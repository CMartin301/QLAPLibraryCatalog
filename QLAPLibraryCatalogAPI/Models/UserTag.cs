namespace QLAPLibraryCatalogAPI.Models
{
    /// <summary>
    /// Junction table for many-to-many relationship between Users and Tags
    /// Allows users to be tagged for categorization/filtering
    /// </summary>
    public partial class UserTag
    {
        public int UserId { get; set; }

        public int TagId { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;

        public virtual Tag Tag { get; set; } = null!;
    }
}