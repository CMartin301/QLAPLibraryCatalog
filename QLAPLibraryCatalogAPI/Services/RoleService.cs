using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface IRoleService
    {
#pragma warning disable 1591
        Task<Role?> GetRoleByNameAsync(string roleName);
        Task AssignRoleToUserAsync(int userId, string roleName, int? grantedBy = null);
#pragma warning restore 1591
    }
    /// <summary>
    /// Service/data layer operations on/access to roles
    /// </summary>
    public class RoleService : IRoleService
    {
        private readonly LibraryCatalogContext _context;
        /// <summary> Constructor </summary>
        public RoleService(LibraryCatalogContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Gets Role by name
        /// </summary>
        /// <param name="roleName"></param>
        /// <returns></returns>
        public async Task<Role?> GetRoleByNameAsync(string roleName)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName.ToLower() == roleName.ToLower());
        }
        /// <summary>
        /// Adds user role by name
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="roleName"></param>
        /// <param name="grantedBy"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task AssignRoleToUserAsync(int userId, string roleName, int? grantedBy = null)
        {
            var role = await GetRoleByNameAsync(roleName);
            if (role == null) 
                throw new InvalidOperationException($"Role '{roleName}' does not exist");

            var existingUserRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == role.RoleId);
            
            if (existingUserRole == null)
            {
                var userRole = new UserRole
                {
                    UserId = userId,
                    RoleId = role.RoleId,
                    GrantedAt = DateTime.UtcNow,
                    GrantedBy = grantedBy
                };
                
                _context.UserRoles.Add(userRole);
                await _context.SaveChangesAsync();
            }
        }

    }
}