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
        // Task<MediaDto> CreateMediaAsync(CreateMediaDto createMediaDto);
        // Task<MediaDto?> UpdateMediaAsync(int id, CreateMediaDto updateMediaDto);
        // Task<bool> DeleteMediaAsync(int id);
        Task<bool> DeactivateUserAsync(int userId);
        Task<bool> ReactivateUserAsync(int userId);
    }

    public class UsersService : IUsersService
    {
        private readonly LibraryCatalogContext _context;

        public UsersService(LibraryCatalogContext context)
        {
            _context = context;
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

        // public async Task<MediaDto> CreateUserAsync(CreateMediaDto createMediaDto)
        // {
        //     var media = new Media
        //     {
        //         MediaTypeId = createMediaDto.MediaTypeId,
        //         Title = createMediaDto.Title,
        //         Subtitle = createMediaDto.Subtitle,
        //         Creator = createMediaDto.Creator,
        //         Publisher = createMediaDto.Publisher,
        //         PublicationDate = createMediaDto.PublicationDate,
        //         Language = createMediaDto.Language,
        //         Genre = createMediaDto.Genre,
        //         Description = createMediaDto.Description,
        //         CoverImageUrl = createMediaDto.CoverImageUrl,
        //         Isbn10 = createMediaDto.Isbn10,
        //         Isbn13 = createMediaDto.Isbn13,
        //         PageCount = createMediaDto.PageCount,
        //         IssueNumber = createMediaDto.IssueNumber,
        //         Volume = createMediaDto.Volume,
        //         CreatedAt = DateTime.UtcNow,
        //         UpdatedAt = DateTime.UtcNow
        //     };

        //     _context.Media.Add(media);
        //     await _context.SaveChangesAsync();

        //     return await GetMediaByIdAsync(media.MediaId) ?? throw new InvalidOperationException("Failed to retrieve created media");
        // }

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