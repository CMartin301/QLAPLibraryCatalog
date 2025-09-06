namespace QLAPLibraryCatalogAPI.Models.DTOs
{
    /// <summary>
    /// Data object for Loan without details
    /// </summary>
    public class LoanDto
    {
        /// <summary> Unique identifier for the loan </summary>
        public int LoanId { get; set; }
        /// <summary> identifier for the request the loan came from/started as </summary>
        public int RequestId { get; set; }
        /// <summary> Start date of the loan </summary>
        public DateOnly? StartDate { get; set; }
        /// <summary> End date/due date of the loan </summary>
        public DateOnly? DueDate { get; set; }
        /// <summary> Date at which both borrower and lender have confirmed return</summary>
        public DateOnly? ReturnedDate { get; set; }
        /// <summary> Status, ex. pending, complete, etc. </summary>
        public string? Status { get; set; } = "active";
        /// <summary> Date and time for borrower confirming return </summary>
        public DateTime? BorrowerReturnedAt { get; set; }
        /// <summary> Borrower notes on return </summary>
        public string? BorrowerReturnNotes { get; set; }
        /// <summary> Date and time for lender confirming return </summary>
        public DateTime? LenderConfirmedReturnAt { get; set; }
        /// <summary> Lender notes on return </summary>
        public string? LenderReturnNotes { get; set; }
    }
    /// <summary>
    /// Comprehensive loan DTO that includes related entity details for display purposes
    /// </summary>
    public class LoanWithDetailsDto
    {
        /// <summary> Unique identifier for the loan </summary>
        public int LoanId { get; set; }
        /// <summary> identifier for the request the loan came from/started as </summary>
        public int RequestId { get; set; }
        /// <summary> Start date of the loan </summary>
        public DateOnly? StartDate { get; set; }
        /// <summary> End date/due date of the loan </summary>
        public DateOnly? DueDate { get; set; }
        /// <summary> Date the media was actually returned </summary>
        public DateOnly? ReturnedDate { get; set; }
        /// <summary> Status, ex. pending, complete, etc. </summary>
        public string? Status { get; set; } = "active";
        /// <summary> Date and time for borrower confirming return </summary>
        public DateTime? BorrowerReturnedAt { get; set; }
        /// <summary> Borrower notes on return </summary>
        public string? BorrowerReturnNotes { get; set; }
        /// <summary> Date and time for lender confirming return </summary>
        public DateTime? LenderConfirmedReturnAt { get; set; }
        /// <summary> Lender notes on return </summary>
        public string? LenderReturnNotes { get; set; }

        // Media information
        /// <summary> Title of media on loan </summary>
        public string MediaTitle { get; set; } = string.Empty;
        /// <summary> Type of media on loan </summary>
        public string MediaType { get; set; } = string.Empty;
        /// <summary> Creator/author of media on loan </summary>
        public string? MediaCreator { get; set; }
        /// <summary> Genre of media on loan </summary>
        public string? MediaGenre { get; set; }

        // User information
        /// <summary> UserId of borrower </summary>
        public int BorrowerId { get; set; }
        /// <summary> Username of borrower </summary>
        public string BorrowerUsername { get; set; } = string.Empty;
        /// <summary> UserId of media owner </summary>
        public int OwnerId { get; set; }
        /// <summary> Username of owner of media </summary>
        public string OwnerUsername { get; set; } = string.Empty;

        // Copy-specific information
        /// <summary> CopyID of copy on loan </summary>
        public int CopyId { get; set; }
        /// <summary> Confition of copy on loan </summary>
        public string? CopyCondition { get; set; }
        /// <summary> Notes about copy on loan </summary>
        public string? CopyNotes { get; set; }

        // Calculated fields for display
        /// <summary> Number of days past the due date </summary>
        public int? DaysOverdue { get; set; }
        /// <summary> Whether the media/loan is currently overdue </summary>
        public bool IsOverdue { get; set; }
    }
    // public class ReturnLoanDto
    // {
    //     public DateOnly? ReturnedDate { get; set; }
    //     public string? ReturnNotes { get; set; }
    // }
}
