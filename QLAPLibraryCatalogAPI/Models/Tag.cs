using System.ComponentModel.DataAnnotations;

namespace QLAPLibraryCatalogAPI.Models
{
    public partial class Tag
    {
        public Tag()
        {
            MediaTags = new HashSet<MediaTag>();
        }

        public int TagId { get; set; }

        [Required]
        [StringLength(50)]
        public string TagName { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public int CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int UpdatedBy { get; set; }

        public virtual ICollection<MediaTag> MediaTags { get; set; }
        public virtual ICollection<UserTag> UserTags { get; set; } // Added for user tag relationship
    }
}