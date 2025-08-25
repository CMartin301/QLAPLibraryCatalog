using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models;

public partial class BorrowRequest
{
    public int RequestId { get; set; }

    public int BorrowerId { get; set; }

    public int CopyId { get; set; }

    public string? Status { get; set; }

    public string? Message { get; set; }

    public DateOnly? RequestedStartDate { get; set; }

    public DateOnly? RequestedEndDate { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime? DeniedAt { get; set; }

    public string? DenialReason { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User Borrower { get; set; } = null!;

    public virtual UserMediaCopy Copy { get; set; } = null!;

    public virtual Loan? Loan { get; set; }
}
