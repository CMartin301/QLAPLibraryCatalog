namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    // Media Types
    public class MediaTypeDto
    {
        public int MediaTypeId { get; set; }
        public string Name { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? Description { get; set; }
    }
    public class CreateMediaTypeDto
    {
        public string Name { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? Description { get; set; }
    }
    // Media
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
        public List<MediaCopyDto> Copies { get; set; } = new();
    }

    public class CreateMediaDto
    {
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
    }

    // Media Copies
    public class MediaWithCopies : Media {
        public bool isOwned { get; set; }
        public List<MediaCopy>? userCopies { get; set; }
    }

    public class MediaCopyDto
    {
        public int CopyId { get; set; }
        public int UserId { get; set; }
        public int MediaId { get; set; }
        public string? Condition { get; set; }
        public string? Notes { get; set; }
        public bool? IsAvailable { get; set; }
        public string? CurrentLocationZoneName { get; set; }
        public string? HomeLocationZoneName { get; set; }

        public string? MediaTitle { get; set; }
        public string? MediaCreator { get; set; }
        public string? OwnerUsername { get; set; }
        public int? OwnerUserId { get; set; }


//   // Media fields (following your existing pattern)
        //   mediaTitle: string;
        //   mediaCreator?: string;

        //   // Owner fields (following your BorrowRequestDto pattern)
        //   ownerUsername: string;
        //   ownerUserId: number;

        // public MediaDto Media { get; set; } = null!;
    }

    public class CreateMediaCopyDto
    {
        public int UserId { get; set; }
        public int MediaId { get; set; }
        public string? Condition { get; set; }
        public string? Notes { get; set; }
        public bool? IsAvailable { get; set; }
        public int? HomeLocationZoneId { get; set; }
        
    }
}