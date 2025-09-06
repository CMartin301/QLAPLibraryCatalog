namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    public class LoanDto
    {
        public int LoanId { get; set; }
        public int RequestId { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? DueDate { get; set; }
        public DateOnly? ReturnedDate { get; set; }
        public string? Status { get; set; } = "active";
        public string? ReturnNotes { get; set; }
        public decimal? LateFeeAmount { get; set; }
        public bool? LateFeePaid { get; set; }
    }
/// <summary>
    /// Comprehensive loan DTO that includes related entity details for display purposes
    /// </summary>
    public class LoanWithDetailsDto
    {
        // Basic loan information
        public int LoanId { get; set; }
        public int RequestId { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? DueDate { get; set; }
        public DateOnly? ReturnedDate { get; set; }
        public string Status { get; set; } = "active";
        public string? ReturnNotes { get; set; }
        public decimal? LateFeeAmount { get; set; }
        public bool? LateFeePaid { get; set; }
        
        // Media information
        public string MediaTitle { get; set; } = string.Empty;
        public string MediaType { get; set; } = string.Empty;
        public string? MediaAuthor { get; set; }
        public string? MediaGenre { get; set; }
        
        // User information
        public int BorrowerId { get; set; }
        public string BorrowerUsername { get; set; } = string.Empty;
        public int OwnerId { get; set; }
        public string OwnerUsername { get; set; } = string.Empty;
        
        // Copy-specific information
        public int CopyId { get; set; }
        public string? CopyCondition { get; set; }
        public string? CopyNotes { get; set; }
        
        // Calculated fields for display
        public int? DaysOverdue { get; set; }
        public bool IsOverdue { get; set; }
        public string LoanPeriodDisplay { get; set; } = string.Empty;
    }
    public class ReturnLoanDto
    {
        public DateOnly? ReturnedDate { get; set; }
        public string? ReturnNotes { get; set; }
        public decimal? LateFeePerDay { get; set; }
    }
}
