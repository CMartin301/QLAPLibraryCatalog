using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;
using QLAPLibraryCatalogAPI.Data;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface IAuthService
    {
        // Task<AuthResponseDto?> AuthenticateAsync(LoginDto loginDto);
        // string GenerateJwtToken(int userId, string email);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly LibraryCatalogContext _context;

        public AuthService(IConfiguration configuration, LibraryCatalogContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        // public async Task<AuthResponseDto?> AuthenticateAsync(LoginDto loginDto)
        // {
        //     var user = await _usersService.GetUserByEmailAsync(loginDto.Email);
        //     if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
        //         return null;

        //     if (user.IsActive != true)
        //         return null;

        //     var token = GenerateJwtToken(user.UserId, user.Email);
        //     var expiresAt = DateTime.UtcNow.AddHours(24); // Token expires in 24 hours

        //     var userDto = new UserDto
        //     {
        //         UserId = user.UserId,
        //         Email = user.Email,
        //         Username = user.Username,
        //         EmailVerified = user.EmailVerified,
        //         IsActive = user.IsActive,
        //         CreatedAt = user.CreatedAt,
        //         UpdatedAt = user.UpdatedAt
        //     };

        //     return new AuthResponseDto
        //     {
        //         Token = token,
        //         ExpiresAt = expiresAt,
        //         User = userDto
        //     };
        // }

        // public string GenerateJwtToken(int userId, string email)
        // {
        //     var jwtSettings = _configuration.GetSection("JwtSettings");
        //     var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        //     var issuer = jwtSettings["Issuer"] ?? "QLAPLibraryAPI";
        //     var audience = jwtSettings["Audience"] ?? "QLAPLibraryClients";

        //     var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        //     var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //     var claims = new[]
        //     {
        //         new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        //         new Claim(ClaimTypes.Email, email),
        //         new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        //         new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        //     };

        //     var token = new JwtSecurityToken(
        //         issuer: issuer,
        //         audience: audience,
        //         claims: claims,
        //         expires: DateTime.UtcNow.AddHours(24),
        //         signingCredentials: credentials
        //     );

        //     return new JwtSecurityTokenHandler().WriteToken(token);
        // }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}