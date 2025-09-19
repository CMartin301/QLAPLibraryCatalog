using System.ComponentModel.DataAnnotations;

namespace QLAPLibraryCatalogAPI.Models
{
    /// <summary>
    /// Represents a genre classification for media items
    /// </summary>
    public partial class Genre
    {
        public Genre()
        {
            MediaGenres = new HashSet<MediaGenre>();
        }

        public int GenreId { get; set; }

        [Required]
        [StringLength(100)] // Updated to match your existing database (100 chars instead of 50)
        public string GenreName { get; set; } = null!;

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public int CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int UpdatedBy { get; set; }

        // Navigation properties
        public virtual ICollection<MediaGenre> MediaGenres { get; set; }
    }
}