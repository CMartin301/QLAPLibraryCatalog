using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary>
    /// Interface for UserProfile service operations
    /// </summary>
    public interface IUserProfilesService
    {
#pragma warning disable 1591
        Task<UserProfileDto?> GetUserProfileAsync(int userId);
        Task<UserWithProfileDto?> GetUserWithProfileAsync(int userId);
        Task<UserProfileDto> CreateOrUpdateUserProfileAsync(int userId, CreateOrUpdateUserProfileDto profileDto);
        Task<bool> DeleteUserProfileAsync(int userId);
        Task<bool> AddUserTagAsync(int userId, int tagId);
        Task<bool> RemoveUserTagAsync(int userId, int tagId);
        Task<IEnumerable<TagDto>> GetUserTagsAsync(int userId);
#pragma warning restore 1591
    }

    /// <summary>
    /// Service for user profile-related operations
    /// </summary>
    public class UserProfilesService : IUserProfilesService
    {
        private readonly LibraryCatalogContext _context;

        /// <summary>Constructor</summary>
        public UserProfilesService(LibraryCatalogContext context) => _context = context;

        /// <summary>
        /// Gets user profile by user ID
        /// </summary>
        public async Task<UserProfileDto?> GetUserProfileAsync(int userId)
        {
            return await _context.UserProfiles
                .Include(up => up.User)
                    .ThenInclude(u => u.UserTags)
                        .ThenInclude(ut => ut.Tag)
                .Where(up => up.UserId == userId)
                .Select(profile => MapUserProfile(profile))
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Gets comprehensive user information including profile and tags
        /// </summary>
        public async Task<UserWithProfileDto?> GetUserWithProfileAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.UserPreferences)
                .Include(u => u.UserProfile)
                .Include(u => u.UserTags)
                    .ThenInclude(ut => ut.Tag)
                .Where(u => u.UserId == userId && u.IsActive == true)
                .FirstOrDefaultAsync();

            return user == null ? null : MapUserWithProfile(user);
        }

        /// <summary>
        /// Creates or updates a user profile
        /// </summary>
        public async Task<UserProfileDto> CreateOrUpdateUserProfileAsync(int userId, CreateOrUpdateUserProfileDto profileDto)
        {
            // Verify user exists and is active
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId && u.IsActive == true);
            
            if (user == null)
                throw new InvalidOperationException("User not found or inactive");

            var existingProfile = await _context.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId == userId);

            if (existingProfile == null)
            {
                // Create new profile
                var newProfile = new UserProfile
                {
                    UserId = userId,
                    ProfileDescription = profileDto.ProfileDescription,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.UserProfiles.Add(newProfile);
            }
            else
            {
                // Update existing profile
                existingProfile.ProfileDescription = profileDto.ProfileDescription;
                existingProfile.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return await GetUserProfileAsync(userId) 
                ?? throw new InvalidOperationException("Failed to retrieve created/updated profile");
        }

        /// <summary>
        /// Deletes a user profile
        /// </summary>
        public async Task<bool> DeleteUserProfileAsync(int userId)
        {
            var profile = await _context.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId == userId);

            if (profile == null) return false;

            _context.UserProfiles.Remove(profile);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Adds a tag to a user
        /// </summary>
        public async Task<bool> AddUserTagAsync(int userId, int tagId)
        {
            // Check if the relationship already exists
            var exists = await _context.UserTags
                .AnyAsync(ut => ut.UserId == userId && ut.TagId == tagId);

            if (exists) return false; // Already exists

            // Verify user and tag exist
            var userExists = await _context.Users.AnyAsync(u => u.UserId == userId && u.IsActive == true);
            var tagExists = await _context.Tags.AnyAsync(t => t.TagId == tagId);

            if (!userExists || !tagExists) return false;

            var userTag = new UserTag
            {
                UserId = userId,
                TagId = tagId
            };

            _context.UserTags.Add(userTag);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Removes a tag from a user
        /// </summary>
        public async Task<bool> RemoveUserTagAsync(int userId, int tagId)
        {
            var userTag = await _context.UserTags
                .FirstOrDefaultAsync(ut => ut.UserId == userId && ut.TagId == tagId);

            if (userTag == null) return false;

            _context.UserTags.Remove(userTag);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Gets all tags for a user
        /// </summary>
        public async Task<IEnumerable<TagDto>> GetUserTagsAsync(int userId)
        {
            return await _context.UserTags
                .Include(ut => ut.Tag)
                    .ThenInclude(t => t.MediaTags)
                .Where(ut => ut.UserId == userId)
                .Select(ut => new TagDto
                {
                    TagId = ut.Tag.TagId,
                    TagName = ut.Tag.TagName,
                    MediaTagCount = ut.Tag.MediaTags.Count
                })
                .ToListAsync();
        }

        #region Mapping Methods
        private static UserProfileDto MapUserProfile(UserProfile profile)
        {
            return new UserProfileDto
            {
                UserId = profile.UserId,
                ProfileDescription = profile.ProfileDescription,
                CreatedAt = profile.CreatedAt,
                UpdatedAt = profile.UpdatedAt,
                Username = profile.User?.Username,
                Email = profile.User?.Email,
                UserTags = profile.User?.UserTags?.Select(ut => new TagDto
                {
                    TagId = ut.Tag.TagId,
                    TagName = ut.Tag.TagName
                }).ToList() ?? new List<TagDto>()
            };
        }

        private static UserWithProfileDto MapUserWithProfile(User user)
        {
            return new UserWithProfileDto
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                EmailVerified = user.EmailVerified,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UserPreferences = user.UserPreferences == null ? null : new UserPreferencesDto
                {
                    PreferenceId = user.UserPreferences.PreferenceId,
                    UserId = user.UserPreferences.UserId,
                    DefaultLoanDays = user.UserPreferences.DefaultLoanDays,
                    AutoApproveRequests = user.UserPreferences.AutoApproveRequests,
                    EmailNotifications = user.UserPreferences.EmailNotifications,
                    SmsNotifications = user.UserPreferences.SmsNotifications,
                    NotificationSettings = user.UserPreferences.NotificationSettings
                },
                UserProfile = user.UserProfile == null ? null : new UserProfileDto
                {
                    UserId = user.UserProfile.UserId,
                    ProfileDescription = user.UserProfile.ProfileDescription,
                    CreatedAt = user.UserProfile.CreatedAt,
                    UpdatedAt = user.UserProfile.UpdatedAt,
                    Username = user.Username,
                    Email = user.Email
                },
                UserTags = user.UserTags.Select(ut => new TagDto
                {
                    TagId = ut.Tag.TagId,
                    TagName = ut.Tag.TagName
                }).ToList()
            };
        }
        #endregion
    }
}