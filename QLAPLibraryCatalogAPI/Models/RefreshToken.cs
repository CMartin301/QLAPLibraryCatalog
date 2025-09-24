using System;

namespace QLAPLibraryCatalogAPI.Models
{
    public partial class RefreshToken
    {
        public int RefreshTokenId { get; set; }
        
        public string Token { get; set; } = null!;
        
        public int UserId { get; set; }
        
        public DateTime ExpiresAt { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public bool IsRevoked { get; set; }
        
        public string? CreatedByIp { get; set; }
        
        public DateTime? RevokedAt { get; set; }
        
        public string? RevokedByIp { get; set; }
        
        public string? ReplacedByToken { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;
        
        // Helper properties
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        public bool IsActive => !IsRevoked && !IsExpired;
    }
}