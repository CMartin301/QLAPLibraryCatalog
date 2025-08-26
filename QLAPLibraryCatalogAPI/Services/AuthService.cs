using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;
using QLAPLibraryCatalogAPI.Data;
using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Models;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> AuthenticateAsync(LoginDto loginDto);
        string GenerateJwtToken(int userId, string email);
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

        public async Task<AuthResponseDto?> AuthenticateAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(u => u.UserPreferences)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
                return null;

            if (user.IsActive != true)
                return null;

            var token = GenerateJwtToken(user.UserId, user.Email);

            var hoursValid = _configuration.GetValue<double>("AppSettings:JwtHoursValid");
            var expiresAt = DateTime.UtcNow.AddHours(hoursValid);

            var userDto = new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username
            };
            // if (user.UserPreferences != null)
            // {

            //     var preferences = new UserPreferencesDto
            //     {
            //         UserId = user.UserId,
            //         DefaultLoanDays = userDto.UserPreferences.DefaultLoanDays,
            //         AutoApproveRequests = userDto.UserPreferences.AutoApproveRequests,
            //         EmailNotifications = userDto.UserPreferences.EmailNotifications,
            //         SmsNotifications = userDto.UserPreferences.SmsNotifications,
            //         NotificationSettings = userDto.UserPreferences.NotificationSettings
            //     };

            //     userDto.UserPreferences = preferences;
            // }

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = userDto
            };
        }


        public string GenerateJwtToken(int userId, string email)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var issuer = jwtSettings["Issuer"] ?? "QLAPLibraryCatalog";
            var audience = jwtSettings["Audience"] ?? "QLAPLibraryCatalog";
            
            var hoursValid = _configuration.GetValue<double>("AppSettings:JwtHoursValid");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(hoursValid),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

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