using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary> Interface </summary>
    public interface IUsersService
    {
#pragma warning disable 1591
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<UserDto?> GetUserByEmailAsync(string email);
        Task<UserDto> CreateUserAsync(CreateUserDto registerDto);
        Task<UserPreferencesDto?> UpdateUserPreferencesAsync(int userId, UserPreferencesDto preferencesDto);
        Task<bool> DeactivateUserAsync(int userId);
        Task<bool> ReactivateUserAsync(int userId);
#pragma warning restore 1591
    }

    /// <summary>
    /// Service/data layer operations on/access to users
    /// </summary>
    public class UsersService : IUsersService
    {
        private readonly LibraryCatalogContext _context;
        private readonly IAuthService _authService;
        /// <summary> Constructor </summary>
        public UsersService(LibraryCatalogContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }
        /// <summary>
        /// Gets all users
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(m => m.UserPreferences)
                .Where(m => m.IsActive == true)
                .Select(user => MapUser(user))
                .ToListAsync();
        }
        /// <summary>
        /// Gets user by ID
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(m => m.UserPreferences)
                .Where(m => m.IsActive == true)
                .Where(m => m.UserId == userId)
                .Select(user => MapUser(user))
                .FirstOrDefaultAsync();
        }
        /// <summary>
        /// Gets user by email
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(m => m.UserPreferences)
                .Where(m => m.IsActive == true)
                .Where(m => m.Email == email)
                .Select(user => MapUser(user))
                .FirstOrDefaultAsync();
        }
        /// <summary>
        /// Creates new user
        /// </summary>
        /// <param name="userDto"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task<UserDto> CreateUserAsync(CreateUserDto userDto)
        {
            // Check if user already exists
            var existingUser = await GetUserByEmailAsync(userDto.Email!);
            if (existingUser != null)
                throw new ArgumentException("User with this email already exists");

            var user = new User
            {
                Email = userDto.Email!,
                Username = userDto.Username,
                PasswordHash = _authService.HashPassword(userDto.Password!),
                EmailVerified = false,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create user preferences if provided
            if (userDto.UserPreferences != null)
            {
                var preferences = new UserPreferences
                {
                    UserId = user.UserId,
                    DefaultLoanDays = userDto.UserPreferences.DefaultLoanDays,
                    AutoApproveRequests = userDto.UserPreferences.AutoApproveRequests,
                    EmailNotifications = userDto.UserPreferences.EmailNotifications,
                    SmsNotifications = userDto.UserPreferences.SmsNotifications,
                    NotificationSettings = userDto.UserPreferences.NotificationSettings,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.UserPreferences.Add(preferences);
                await _context.SaveChangesAsync();
                user.UserPreferences = preferences;
            }

            return await GetUserByIdAsync(user.UserId) ?? throw new InvalidOperationException("Failed to retrieve created user");
        }
        /// <summary>
        /// Updates user preferences
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="preferencesDto"></param>
        /// <returns></returns>
        public async Task<UserPreferencesDto?> UpdateUserPreferencesAsync(int userId, UserPreferencesDto preferencesDto)
        {
            var user = await _context.Users
                .Include(u => u.UserPreferences)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return null;

            if (user.UserPreferences == null)
            {
                // Create new preferences if they don't exist
                user.UserPreferences = new UserPreferences
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.UserPreferences.Add(user.UserPreferences);
            }

            var prefs = user.UserPreferences;



            prefs.DefaultLoanDays = preferencesDto.DefaultLoanDays;
            prefs.AutoApproveRequests = preferencesDto.AutoApproveRequests;
            prefs.EmailNotifications = preferencesDto.EmailNotifications;
            prefs.SmsNotifications = preferencesDto.SmsNotifications;
            prefs.NotificationSettings = preferencesDto.NotificationSettings;
            prefs.UpdatedAt = DateTime.UtcNow;

            prefs.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new UserPreferencesDto
            {
                PreferenceId = prefs.PreferenceId,
                UserId = prefs.UserId,
                DefaultLoanDays = prefs.DefaultLoanDays,
                AutoApproveRequests = prefs.AutoApproveRequests,
                EmailNotifications = prefs.EmailNotifications,
                SmsNotifications = prefs.SmsNotifications,
                NotificationSettings = prefs.NotificationSettings
            };
        }
        /// <summary>
        /// Deactivates existing user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>

        public async Task<bool> DeactivateUserAsync(int userId)
        {
            var existing = await _context.Users.FindAsync(userId);
            if (existing == null) return false;

            existing.IsActive = false;

            await _context.SaveChangesAsync();

            return true;
        }
        /// <summary>
        /// Reactivates existing, deactivated user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<bool> ReactivateUserAsync(int userId)
        {
            var existing = await _context.Users.FindAsync(userId);
            if (existing == null) return false;

            existing.IsActive = true;

            await _context.SaveChangesAsync();

            return true;
        }
        #region Mapping Methods
        /// <summary>
        /// Maps a user into a userDto
        /// </summary>
        private static UserDto MapUser(User user)
        {
            return new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                UserPreferences = new UserPreferencesDto
                {
                    UserId = user.UserId,
                    DefaultLoanDays = user.UserPreferences.DefaultLoanDays,
                    AutoApproveRequests = user.UserPreferences.AutoApproveRequests,
                    EmailNotifications = user.UserPreferences.EmailNotifications,
                    SmsNotifications = user.UserPreferences.SmsNotifications,
                    NotificationSettings = user.UserPreferences.NotificationSettings,
                }
            };
        }
        #endregion
    }
}