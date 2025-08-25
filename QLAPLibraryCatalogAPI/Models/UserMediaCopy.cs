using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models;

public partial class UserMediaCopy
{
    public int CopyId { get; set; }

    public int UserId { get; set; }

    public int MediaId { get; set; }

    public string? Condition { get; set; }

    public string? Notes { get; set; }

    public bool? IsAvailable { get; set; }

    public int? MaxLoanDays { get; set; }

    public bool? RequiresApproval { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();

    public virtual Media Media { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
