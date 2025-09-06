using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models;

public partial class Loan
{
    public int LoanId { get; set; }

    public int RequestId { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? DueDate { get; set; }

    public DateOnly? ReturnedDate { get; set; }
    public DateTime? BorrowerReturnedAt { get; set; }
    public DateTime? LenderConfirmedReturnAt { get; set; }
    public string? BorrowerReturnNotes { get; set; }
    public string? LenderReturnNotes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual BorrowRequest Request { get; set; } = null!;
}
