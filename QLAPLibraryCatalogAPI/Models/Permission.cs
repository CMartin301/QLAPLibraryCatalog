using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models
{
    public partial class Permission
    {
        public int PermissionId { get; set; }
        
        public string PermissionName { get; set; } = null!;
        
        public string? Description { get; set; }

        // Navigation properties
        public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}