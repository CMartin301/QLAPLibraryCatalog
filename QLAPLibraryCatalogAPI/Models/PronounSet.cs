using System.ComponentModel.DataAnnotations;

namespace QLAPLibraryCatalogAPI.Models
{
    /// <summary>
    /// Represents a set of pronouns (e.g., "he/him", "she/her")
    /// </summary>
    public partial class PronounSet
    {
        public PronounSet()
        {
            UserPronouns = new HashSet<UserPronoun>();
        }

        public int PronounId { get; set; }

        [Required]
        [StringLength(50)]
        public string PronounText { get; set; } = null!;

        public int DisplayOrder { get; set; }

        public bool IsCommon { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<UserPronoun> UserPronouns { get; set; }
    }
}