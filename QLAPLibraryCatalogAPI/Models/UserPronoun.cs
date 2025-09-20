namespace QLAPLibraryCatalogAPI.Models
{
    /// <summary>
    /// Junction table for many-to-many relationship between Users and PronounSets
    /// </summary>
    public partial class UserPronoun
    {
        public int UserId { get; set; }

        public int PronounId { get; set; }

        public int DisplayOrder { get; set; }

        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;

        public virtual PronounSet PronounSet { get; set; } = null!;
    }
}