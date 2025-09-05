// File: Models/DTOs/BorrowRequestsDtos.cs
namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    public class BorrowRequestDto
    {
        public int RequestId { get; set; }
        public int BorrowerId { get; set; }
        public int CopyId { get; set; }
        public string? Status { get; set; } = "pending";
        public string? Message { get; set; }

        // Match entity: DateOnly?
        public DateOnly? RequestedStartDate { get; set; }
        public DateOnly? RequestedEndDate { get; set; }

        public DateTime? ApprovedAt { get; set; }
        public DateTime? DeniedAt { get; set; }
        public string? DenialReason { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public MediaCopyDto? Copy { get; set; }
        public MediaDto? Media { get; set; }
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

    // public class BorrowRequestQuery
    // {
    //     public int? BorrowerId { get; set; }
    //     public int? OwnerId { get; set; }
    //     public string? Status { get; set; }
    //     public DateTime? CreatedFrom { get; set; }
    //     public DateTime? CreatedTo { get; set; }
    // }

    public class LoanDto
    {
        public int LoanId { get; set; }
        public int RequestId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly DueDate { get; set; }
        public DateOnly? ReturnedDate { get; set; }
        public string? Status { get; set; } = "active";
        public string? ReturnNotes { get; set; }
        public decimal? LateFeeAmount { get; set; }
        public bool? LateFeePaid { get; set; }
    }

    public class ReturnLoanDto
    {
        public DateOnly? ReturnedDate { get; set; }
        public string? ReturnNotes { get; set; }
        public decimal? LateFeePerDay { get; set; }
    }
}
