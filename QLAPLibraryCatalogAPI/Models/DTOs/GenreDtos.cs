using System.ComponentModel.DataAnnotations;

namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    /// <summary>
    /// DTO for returning genre information
    /// </summary>
    public class GenreDto
    {
        public int GenreId { get; set; }
        public string GenreName { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public int? MediaGenreCount { get; set; } // Count of media items with this genre
    }

    /// <summary>
    /// DTO for creating a new genre
    /// </summary>
    public class CreateGenreDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Genre name cannot exceed 100 characters")]
        public string GenreName { get; set; } = null!;
        
        public string? Description { get; set; }
    }

    /// <summary>
    /// DTO for updating an existing genre
    /// </summary>
    public class UpdateGenreDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Genre name cannot exceed 100 characters")]
        public string GenreName { get; set; } = null!;
        
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}