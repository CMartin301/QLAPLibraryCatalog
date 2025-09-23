using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models
{
    public partial class Role
    {
        public int RoleId { get; set; }
        
        public string RoleName { get; set; } = null!;
        
        public string? Description { get; set; }

        // Navigation properties
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}