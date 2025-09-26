
namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public DateTime AccessTokenExpiresAt { get; set; }
        public DateTime RefreshTokenExpiresAt { get; set; }
        public UserDto User { get; set; } = null!;
    }

    public class RefreshTokenDto
    {
        public string RefreshToken { get; set; } = null!;
    }

    public class RevokeTokenDto
    {
        public string? RefreshToken { get; set; }
    }

    // Simple login DTO
    public class LoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}