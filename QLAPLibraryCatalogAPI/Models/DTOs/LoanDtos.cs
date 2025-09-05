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

    public class ReturnLoanDto
    {
        public DateOnly? ReturnedDate { get; set; }
        public string? ReturnNotes { get; set; }
        public decimal? LateFeePerDay { get; set; }
    }
}
