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
        public string? MediaTypeName { get; set; }

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
        public int? TotalCopiesCount { get; set; }
        public int? AvailableCopiesCount { get; set; }
        // public MediaTypeDto? MediaType { get; set; }

    public List<LocationInfo>? NearbyLocations { get; set; }
    public decimal? NearestCopyDistance { get; set; }
    public string? NearestCopyLocationName { get; set; }

        public List<TagDto> Tags { get; set; } = new();
    }
    // New supporting class
public class MediaSearchRequest
{
    public bool IncludeCopies { get; set; } = false;
    public string? Search { get; set; }
    public int? UserLocationZoneId { get; set; }  // Selected zip code
    public decimal? MaxDistanceMiles { get; set; } = 10;  // Default 10 miles
}
    public class LocationInfo
    {
        public int ZoneId { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public decimal Distance { get; set; }
        public int AvailableCopiesCount { get; set; }
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
        public MediaDto? Media { get; set; }
    }

    public class UserMediaCopyDto
    {
        public int MediaId { get; set; }
        public int MediaTypeId { get; set; }
        public string? MediaTypeName { get; set; }

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
        

        public int CopyId { get; set; }
        public int UserId { get; set; }
        public string? Condition { get; set; }
        public string? Notes { get; set; }
        public bool? IsAvailable { get; set; }
        public string? CurrentLocationZoneName { get; set; }
        public string? HomeLocationZoneName { get; set; }
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