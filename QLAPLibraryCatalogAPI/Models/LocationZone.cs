namespace QLAPLibraryCatalogAPI.Models
{
    /// <summary>
    /// Represents a geographic zone for location-based filtering
    /// </summary>
    public class LocationZone
    {
        public int ZoneId { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public string? ZoneType { get; set; }
        public decimal? CenterLat { get; set; }
        public decimal? CenterLong { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<MediaCopy> CurrentLocationCopies { get; set; } = new List<MediaCopy>();
        public virtual ICollection<MediaCopy> HomeLocationCopies { get; set; } = new List<MediaCopy>();
    }
}