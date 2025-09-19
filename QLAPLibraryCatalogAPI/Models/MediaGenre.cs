using System.ComponentModel.DataAnnotations;

namespace QLAPLibraryCatalogAPI.Models
{
    /// <summary>
    /// Junction table for many-to-many relationship between Media and Genres
    /// </summary>
    public partial class MediaGenre
    {
        public int MediaId { get; set; }

        public int GenreId { get; set; }

        public DateTime CreatedAt { get; set; }

        public int CreatedBy { get; set; }

        // Navigation properties
        public virtual Media Media { get; set; } = null!;

        public virtual Genre Genre { get; set; } = null!;
    }
}