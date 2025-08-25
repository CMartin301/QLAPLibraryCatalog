namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    public class MediaDto
    {
        public int MediaId { get; set; }
        public int MediaTypeId { get; set; }
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Creator { get; set; } = null!;
        public string? Publisher { get; set; }
        public DateOnly? PublicationDate { get; set; }
        public string? Language { get; set; }
        public string? Genre { get; set; }
        public string? Description { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Isbn10 { get; set; }
        public string? Isbn13 { get; set; }
        public int? PageCount { get; set; }
        public string? IssueNumber { get; set; }
        public string? Volume { get; set; }
        public MediaTypeDto? MediaType { get; set; }
    }

    public class MediaTypeDto
    {
        public int MediaTypeId { get; set; }
        public string Name { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? Description { get; set; }
    }

    // public class CreateMediaDto
    // {
    //     public int MediaTypeId { get; set; }
    //     public string Title { get; set; } = null!;
    //     public string? Subtitle { get; set; }
    //     public string Creator { get; set; } = null!;
    //     public string? Publisher { get; set; }
    //     public DateOnly? PublicationDate { get; set; }
    //     public string? Language { get; set; }
    //     public string? Genre { get; set; }
    //     public string? Description { get; set; }
    //     public string? CoverImageUrl { get; set; }
    //     public string? Isbn10 { get; set; }
    //     public string? Isbn13 { get; set; }
    //     public int? PageCount { get; set; }
    //     public string? IssueNumber { get; set; }
    //     public string? Volume { get; set; }
    // }
}