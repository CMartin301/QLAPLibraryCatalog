using System.ComponentModel.DataAnnotations;

namespace QLAPLibraryCatalogAPI.Models
{
    public partial class MediaTag
    {
        public int MediaId { get; set; }

        public int TagId { get; set; }

        public DateTime CreatedAt { get; set; }

        public int CreatedBy { get; set; }

        public virtual Media Media { get; set; } = null!;

        public virtual Tag Tag { get; set; } = null!;
    }
}