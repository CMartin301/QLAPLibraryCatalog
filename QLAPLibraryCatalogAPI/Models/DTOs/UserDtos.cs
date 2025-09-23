using System.ComponentModel.DataAnnotations;

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
        public bool? EmailNotifications { get; set; }
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
        public int? MediaItemCount { get; set; }
        public int? LoanCount { get; set; }

        // Optional: Include user tags
        public List<TagDto> UserTags { get; set; } = new();
        public List<UserPronounDto> UserPronouns { get; set; } = new();
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

    /// <summary>
    /// DTO for pronoun set information
    /// </summary>
    public class PronounSetDto
    {
        public int PronounId { get; set; }
        public string PronounText { get; set; } = null!;
        public int DisplayOrder { get; set; }
        public bool IsCommon { get; set; }
    }

    /// <summary>
    /// DTO for creating/updating user pronouns
    /// </summary>
    public class UpdateUserPronounsDto
    {
        public List<UserPronounDto> Pronouns { get; set; } = new();
    }

    /// <summary>
    /// DTO for user pronoun with display order
    /// </summary>
    public class UserPronounDto
    {
        public int PronounId { get; set; }
        public string PronounText { get; set; } = null!;
        public int DisplayOrder { get; set; }
    }

    /// <summary>
    /// DTO for creating a custom pronoun set
    /// </summary>
    public class CreatePronounSetDto
    {
        [Required]
        [StringLength(50)]
        public string PronounText { get; set; } = null!;
    }


}