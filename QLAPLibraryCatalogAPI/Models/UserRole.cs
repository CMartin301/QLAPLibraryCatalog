using System;

namespace QLAPLibraryCatalogAPI.Models
{
    public partial class UserRole
    {
        public int UserId { get; set; }
        
        public int RoleId { get; set; }
        
        public DateTime? GrantedAt { get; set; }
        
        public int? GrantedBy { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Role Role { get; set; } = null!;
        public virtual User? GrantedByUser { get; set; }
    }
}