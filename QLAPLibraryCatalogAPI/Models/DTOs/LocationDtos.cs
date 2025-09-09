namespace QLAPLibraryCatalogAPI.Models.DTOs
{

    public class LocationZoneDto
    {
        public int ZoneId { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public string? ZoneType { get; set; }
        public decimal? CenterLat { get; set; }
        public decimal? CenterLong { get; set; }
    }

}
