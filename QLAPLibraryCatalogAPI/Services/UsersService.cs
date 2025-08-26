using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface IUsersService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<UserDto?> GetUserByEmailAsync(string email);
        Task<UserDto> CreateUserAsync(CreateUserDto registerDto);
        // Task<UserDto?> UpdateUserAsync(int userId, CreateUserDto updateDto);
        // Task<UserPreferencesDto?> UpdateUserPreferencesAsync(int userId, UserPreferencesDto preferencesDto);
        Task<bool> DeactivateUserAsync(int userId);
        Task<bool> ReactivateUserAsync(int userId);
    }

    public class UsersService : IUsersService
    {
        private readonly LibraryCatalogContext _context;
        private readonly IAuthService _authService;

        public UsersService(LibraryCatalogContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }
        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(m => m.UserPreferences)
                .Where(m => m.IsActive == true)
                .Select(m => new UserDto
                {
                    UserId = m.UserId,
                    Email = m.Email,
                    Username = m.Username,
                    UserPreferences = new UserPreferencesDto
                    {
                        UserId = m.UserId,
                        DefaultLoanDays = m.UserPreferences.DefaultLoanDays,
                        AutoApproveRequests = m.UserPreferences.AutoApproveRequests,
                        EmailNotifications = m.UserPreferences.EmailNotifications,
                        SmsNotifications = m.UserPreferences.SmsNotifications,
                        NotificationSettings = m.UserPreferences.NotificationSettings,
                    }
                })
                .ToListAsync();
        }

        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(m => m.UserPreferences)
                .Where(m => m.IsActive == true)
                .Where(m => m.UserId == userId)
                .Select(m => new UserDto
                {
                    UserId = m.UserId,
                    Email = m.Email,
                    Username = m.Username,
                    UserPreferences = new UserPreferencesDto
                    {
                        UserId = m.UserId,
                        DefaultLoanDays = m.UserPreferences.DefaultLoanDays,
                        AutoApproveRequests = m.UserPreferences.AutoApproveRequests,
                        EmailNotifications = m.UserPreferences.EmailNotifications,
                        SmsNotifications = m.UserPreferences.SmsNotifications,
                        NotificationSettings = m.UserPreferences.NotificationSettings,
                    }
                })
                .FirstOrDefaultAsync();
        }
        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(m => m.UserPreferences)
                .Where(m => m.IsActive == true)
                .Where(m => m.Email == email)
                .Select(m => new UserDto
                {
                    UserId = m.UserId,
                    Email = m.Email,
                    Username = m.Username,
                    UserPreferences = new UserPreferencesDto
                    {
                        UserId = m.UserId,
                        DefaultLoanDays = m.UserPreferences.DefaultLoanDays,
                        AutoApproveRequests = m.UserPreferences.AutoApproveRequests,
                        EmailNotifications = m.UserPreferences.EmailNotifications,
                        SmsNotifications = m.UserPreferences.SmsNotifications,
                        NotificationSettings = m.UserPreferences.NotificationSettings,
                    }
                })
                .FirstOrDefaultAsync();
        }
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


        // public async Task<MediaDto?> UpdateMediaAsync(int id, CreateMediaDto updateMediaDto)
        // {
        //     var existing = await _context.Media.FindAsync(id);
        //     if (existing == null) return null;

        //     existing.MediaTypeId = updateMediaDto.MediaTypeId;
        //     existing.Title = updateMediaDto.Title;
        //     existing.Subtitle = updateMediaDto.Subtitle;
        //     existing.Creator = updateMediaDto.Creator;
        //     existing.Publisher = updateMediaDto.Publisher;
        //     existing.PublicationDate = updateMediaDto.PublicationDate;
        //     existing.Language = updateMediaDto.Language;
        //     existing.Genre = updateMediaDto.Genre;
        //     existing.Description = updateMediaDto.Description;
        //     existing.CoverImageUrl = updateMediaDto.CoverImageUrl;
        //     existing.Isbn10 = updateMediaDto.Isbn10;
        //     existing.Isbn13 = updateMediaDto.Isbn13;
        //     existing.PageCount = updateMediaDto.PageCount;
        //     existing.IssueNumber = updateMediaDto.IssueNumber;
        //     existing.Volume = updateMediaDto.Volume;
        //     existing.UpdatedAt = DateTime.UtcNow;

        //     await _context.SaveChangesAsync();

        //     return await GetMediaByIdAsync(id);
        // }

        // public async Task<bool> DeleteMediaAsync(int id)
        // {
        //     var media = await _context.Media.FindAsync(id);
        //     if (media == null) return false;

        //     _context.Media.Remove(media);
        //     await _context.SaveChangesAsync();

        //     return true;
        // }
        

        public async Task<bool> DeactivateUserAsync(int userId)
        {
            var existing = await _context.Users.FindAsync(userId);
            if (existing == null) return false;

            existing.IsActive = false;
            
            await _context.SaveChangesAsync();
            
            return true;
        }
        
        public async Task<bool> ReactivateUserAsync(int userId)
        {
            var existing = await _context.Users.FindAsync(userId);
            if (existing == null) return false;

            existing.IsActive = true;
            
            await _context.SaveChangesAsync();
            
            return true;
        }
    }
}