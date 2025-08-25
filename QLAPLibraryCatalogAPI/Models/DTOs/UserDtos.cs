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
        public int MediaTypeId { get; set; }
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Creator { get; set; } = null!;
        public string? Publisher { get; set; }
        public DateOnly? PublicationDate { get; set; }
        public string? Language { get; set; }
        public string? Genre { get; set; }
        public string? Description { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Isbn10 { get; set; }
        public string? Isbn13 { get; set; }
        public int? PageCount { get; set; }
        public string? IssueNumber { get; set; }
        public string? Volume { get; set; }
    }
    public class UserPreferencesDto
    {
        public int PreferenceId { get; set; }
        public int UserId { get; set; }
        public int? DefaultLoanDays { get; set; }
        public bool? AutoApproveRequests { get; set; }
        public bool? EmailNotifications { get; set; }
        public bool? SmsNotifications { get; set; }
        public string? NotificationSettings { get; set; }
    }

    public class CreateUserPreferencesDto
    {
        public int UserId { get; set; }
        public int? DefaultLoanDays { get; set; }
        public bool? AutoApproveRequests { get; set; }
        public bool? EmailNotifications { get; set; }
        public bool? SmsNotifications { get; set; }
        public string? NotificationSettings { get; set; }
    }


}