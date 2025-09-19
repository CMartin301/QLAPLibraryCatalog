using System.ComponentModel.DataAnnotations;

namespace QLAPLibraryCatalogAPI.Models
{
    /// <summary>
    /// Represents extended user profile information
    /// </summary>
    public partial class UserProfile
    {
        public int UserId { get; set; }

        public string? ProfileDescription { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation property
        public virtual User User { get; set; } = null!;
    }
}