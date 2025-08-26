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
}