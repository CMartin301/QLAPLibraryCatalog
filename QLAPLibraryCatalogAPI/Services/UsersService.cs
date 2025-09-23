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
        Task<UserDto?> UpdateUserPasswordAsync(int userId, string newPassword);
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
        private readonly IRoleService _roleService;
        /// <summary> Constructor </summary>
        public UsersService(LibraryCatalogContext context, IAuthService authService, IRoleService roleService)
        {
            _context = context;
            _authService = authService;
            _roleService = roleService;
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

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Create user
                var user = await CreateUserEntityAsync(userDto);
                
                // Create preferences
                await CreateUserPreferencesAsync(user.UserId, userDto.UserPreferences);
                
                // Create profile
                await CreateUserProfileAsync(user.UserId);
                
                // Assign default role
                await _roleService.AssignRoleToUserAsync(user.UserId, "user");
                
                await transaction.CommitAsync();
                
                return await GetUserByIdAsync(user.UserId) ?? 
                    throw new InvalidOperationException("Failed to retrieve created user");
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        /// <summary>
        /// Updates user preferences
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        public async Task<UserDto?> UpdateUserPasswordAsync(int userId, string newPassword)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return null;

            string passwordHash = _authService.HashPassword(newPassword);
            user.PasswordHash = passwordHash;


            await _context.SaveChangesAsync();

            return await GetUserByIdAsync(user.UserId) ?? throw new InvalidOperationException("Failed to retrieve user");
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



            prefs.EmailNotifications = preferencesDto.EmailNotifications;
            prefs.UpdatedAt = DateTime.UtcNow;

            prefs.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new UserPreferencesDto
            {
                PreferenceId = prefs.PreferenceId,
                UserId = prefs.UserId,
                EmailNotifications = prefs.EmailNotifications,
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
                UserPreferences = user.UserPreferences == null ? null : new UserPreferencesDto
                    {
                        PreferenceId = user.UserPreferences.PreferenceId, 
                        UserId = user.UserId,
                        EmailNotifications = user.UserPreferences.EmailNotifications,
                    }
            };
        }
        #endregion
        #region Helper Functions
        private async Task<User> CreateUserEntityAsync(CreateUserDto userDto)
        {
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
            return user;
        }

        private async Task CreateUserPreferencesAsync(int userId, UserPreferencesDto? preferencesDto)
        {
            var preferences = new UserPreferences
            {
                UserId = userId,
                EmailNotifications = preferencesDto?.EmailNotifications,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.UserPreferences.Add(preferences);
            await _context.SaveChangesAsync();
        }

        private async Task CreateUserProfileAsync(int userId)
        {
            var profile = new UserProfile
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync();
        }
        #endregion
    }
}