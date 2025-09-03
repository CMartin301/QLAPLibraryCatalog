namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    public class MediaCopyDto
    {
        public int CopyId { get; set; }
        public int UserId { get; set; }
        public int MediaId { get; set; }
        public string? Condition { get; set; }
        public string? Notes { get; set; }
        public bool? IsAvailable { get; set; }
        public int? MaxLoanDays { get; set; }
        public bool? RequiresApproval { get; set; }
        public MediaDto Media { get; set; } = null!;
    }

    public class CreateMediaCopyDto
    {
        public int UserId { get; set; }
        public int MediaId { get; set; }
        public string? Condition { get; set; }
        public string? Notes { get; set; }
        public bool? IsAvailable { get; set; }
        public int? MaxLoanDays { get; set; }
        public bool? RequiresApproval { get; set; }
        
    }

}