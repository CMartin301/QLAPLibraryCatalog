namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    public class TagDto
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = null!;
        public int? MediaTagCount { get; set; }
        public bool IsGenre { get; set; } // Add this
        public string? Description { get; set; } // Add this
    }

    public class CreateTagDto
    {
        public string TagName { get; set; } = null!;
        public bool IsGenre { get; set; } = false; // Add this
        public string? Description { get; set; } // Add this
    }

    // Add this new DTO for updating tags
    public class UpdateTagDto
    {
        public string TagName { get; set; } = null!;
        public bool IsGenre { get; set; }
        public string? Description { get; set; }
    }
}