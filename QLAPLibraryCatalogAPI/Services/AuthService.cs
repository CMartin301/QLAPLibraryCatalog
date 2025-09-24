using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;
using QLAPLibraryCatalogAPI.Data;
using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Models;
using System.Security.Cryptography;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary> Interface </summary>
    public interface IAuthService
    {
#pragma warning disable 1591
        Task<AuthResponseDto?> AuthenticateAsync(LoginDto loginDto, string? ipAddress = null);
        string GenerateJwtToken(int userId, string email);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
        Task<AuthResponseDto?> RefreshTokenAsync(string refreshToken, string? ipAddress = null);
        Task<string> GenerateRefreshTokenAsync(int userId, string? ipAddress = null);
        Task<bool> RevokeRefreshTokenAsync(string refreshToken, string? ipAddress = null);
        Task CleanupExpiredTokensAsync();
#pragma warning restore 1591
    }

    /// <summary>
    /// Service/data layer operations on/access to authentication
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly LibraryCatalogContext _context;
        /// <summary> Constructor </summary>
        public AuthService(IConfiguration configuration, LibraryCatalogContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        /// <summary>
        /// Authenticate user and return both access and refresh tokens
        /// </summary>
        public async Task<AuthResponseDto?> AuthenticateAsync(LoginDto loginDto, string? ipAddress = null)
        {
            var user = await _context.Users
                .Include(u => u.UserPreferences)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash) || user.IsActive != true)
                return null;

            // Generate tokens
            var accessToken = GenerateJwtToken(user.UserId, user.Email);
            var refreshToken = await GenerateRefreshTokenAsync(user.UserId, ipAddress);

            var hoursValid = _configuration.GetValue<double>("JwtHoursValid");
            var accessTokenExpiry = DateTime.UtcNow.AddHours(hoursValid);
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("RefreshTokenDays", 7));

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                AccessTokenExpiresAt = accessTokenExpiry,
                RefreshTokenExpiresAt = refreshTokenExpiry,
                User = new UserDto
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    Username = user.Username,
                    UserPreferences = user.UserPreferences == null ? null : new UserPreferencesDto
                    {
                        PreferenceId = user.UserPreferences.PreferenceId,
                        UserId = user.UserId,
                        EmailNotifications = user.UserPreferences.EmailNotifications
                    }
                }
            };
        }
        /// <summary>
        /// Generate JWT
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="email"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public string GenerateJwtToken(int userId, string email)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var issuer = jwtSettings["Issuer"] ?? "QLAPLibraryCatalog";
            var audience = jwtSettings["Audience"] ?? "QLAPLibraryCatalog";

            var hoursValid = _configuration.GetValue<double>("JwtHoursValid");

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
        /// <summary>
        /// Hashes given string using BCrypt
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
        /// <summary>
        /// Verifies given string using BCrypt
        /// </summary>
        /// <param name="password"></param>
        /// <param name="hash"></param>
        /// <returns></returns>
        public bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        
                
        /// <summary>
        /// Generates a new refresh token for the user
        /// </summary>
        public async Task<string> GenerateRefreshTokenAsync(int userId, string? ipAddress = null)
        {
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            
            var tokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("RefreshTokenDays", 7)),
                CreatedAt = DateTime.UtcNow,
                CreatedByIp = ipAddress,
                IsRevoked = false
            };
            
            _context.RefreshTokens.Add(tokenEntity);
            await _context.SaveChangesAsync();
            
            return refreshToken;
        }

        /// <summary>
        /// Validates refresh token and generates new access token
        /// </summary>
        public async Task<AuthResponseDto?> RefreshTokenAsync(string refreshToken, string? ipAddress = null)
        {
            var token = await _context.RefreshTokens
                .Include(rt => rt.User)
                .ThenInclude(u => u.UserPreferences)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);
            
            if (token == null || !token.IsActive || token.User.IsActive != true)
                return null;
            
            // Generate new tokens
            var newAccessToken = GenerateJwtToken(token.UserId, token.User.Email);
            var newRefreshToken = await GenerateRefreshTokenAsync(token.UserId, ipAddress);
            
            // Revoke old refresh token
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.ReplacedByToken = newRefreshToken;
            
            await _context.SaveChangesAsync();
            
            var accessTokenExpiry = DateTime.UtcNow.AddHours(_configuration.GetValue<double>("JwtHoursValid"));
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("RefreshTokenDays", 7));
            
            return new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                AccessTokenExpiresAt = accessTokenExpiry,
                RefreshTokenExpiresAt = refreshTokenExpiry,
                User = new UserDto
                {
                    UserId = token.User.UserId,
                    Email = token.User.Email,
                    Username = token.User.Username,
                    UserPreferences = token.User.UserPreferences == null ? null : new UserPreferencesDto
                    {
                        PreferenceId = token.User.UserPreferences.PreferenceId,
                        UserId = token.User.UserId,
                        EmailNotifications = token.User.UserPreferences.EmailNotifications
                    }
                }
            };
        }

        /// <summary>
        /// Revokes a refresh token
        /// </summary>
        public async Task<bool> RevokeRefreshTokenAsync(string refreshToken, string? ipAddress = null)
        {
            var token = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);
            
            if (token == null || token.IsRevoked)
                return false;
            
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Cleanup expired refresh tokens (call this periodically)
        /// </summary>
        public async Task CleanupExpiredTokensAsync()
        {
            var expiredTokens = await _context.RefreshTokens
                .Where(rt => rt.ExpiresAt < DateTime.UtcNow)
                .ToListAsync();
            
            _context.RefreshTokens.RemoveRange(expiredTokens);
            await _context.SaveChangesAsync();
        }
    }
}