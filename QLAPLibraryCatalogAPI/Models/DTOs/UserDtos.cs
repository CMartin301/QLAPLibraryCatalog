namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string? Username { get; set; }
        public UserPreferencesDto? UserPreferences { get; set; }
    }

    public class CreateUserDto
    {
        public string Email { get; set; } = null!;
        public string? Username { get; set; }
        public string Password { get; set; } = null!;

        public UserPreferencesDto? UserPreferences { get; set; }
    }

    public class UserPreferencesDto
    {
        public int? PreferenceId { get; set; }
        public int UserId { get; set; }
        public int? DefaultLoanDays { get; set; }
        public bool? AutoApproveRequests { get; set; }
        public bool? EmailNotifications { get; set; }
        public bool? SmsNotifications { get; set; }
        public string? NotificationSettings { get; set; }
    }


    // Simple login DTO
    public class LoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    // Auth response
    public class AuthResponseDto
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public UserDto User { get; set; } = null!;
    }


    /// <summary>
    /// DTO for returning user profile information
    /// </summary>
    public class UserProfileDto
    {
        public int UserId { get; set; }
        public string? ProfileDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Optional: Include basic user info
        public string? Username { get; set; }
        public string? Email { get; set; }
        
        // Optional: Include user tags
        public List<TagDto> UserTags { get; set; } = new();
    }

    /// <summary>
    /// DTO for creating or updating a user profile
    /// </summary>
    public class CreateOrUpdateUserProfileDto
    {
        public string? ProfileDescription { get; set; }
    }

    /// <summary>
    /// DTO for comprehensive user information including profile
    /// </summary>
    public class UserWithProfileDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string? Username { get; set; }
        public bool? EmailVerified { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        
        public UserPreferencesDto? UserPreferences { get; set; }
        public UserProfileDto? UserProfile { get; set; }
        public List<TagDto> UserTags { get; set; } = new();
    }
}