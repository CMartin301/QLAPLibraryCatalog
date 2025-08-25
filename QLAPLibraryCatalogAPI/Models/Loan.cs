using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models;

public partial class Loan
{
    public int LoanId { get; set; }

    public int RequestId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly DueDate { get; set; }

    public DateOnly? ReturnedDate { get; set; }

    public string? Status { get; set; }

    public string? ReturnNotes { get; set; }

    public decimal? LateFeeAmount { get; set; }

    public bool? LateFeePaid { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual BorrowRequest Request { get; set; } = null!;
}
