// File: Models/DTOs/BorrowRequestsDtos.cs
namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    public class BorrowRequestDto
{
    public int RequestId { get; set; }
    public int BorrowerId { get; set; }
    public string BorrowerUsername { get; set; } = null!;
    public string OwnerUsername { get; set; } = null!;  
    public int CopyId { get; set; }
    public string? Status { get; set; } = "pending";
    public string? Message { get; set; }
    public DateOnly? RequestedStartDate { get; set; }
    public DateOnly? RequestedEndDate { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime? DeniedAt { get; set; }
    public string? DenialReason { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Flattened media fields
    public string MediaTitle { get; set; } = null!;
    public string MediaCreator { get; set; } = null!;
}

    public class CreateBorrowRequestDto
    {
        public int BorrowerId { get; set; }
        public int CopyId { get; set; }
        public string? Message { get; set; }

        // match entity shape
        public DateOnly? RequestedStartDate { get; set; }
        public DateOnly? RequestedEndDate { get; set; }
    }

    public class DenyBorrowRequestDto
    {
        public string? Reason { get; set; }
    }

}
