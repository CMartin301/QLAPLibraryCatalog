using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models;

public partial class MediaCopy
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
    // Add these properties to your existing MediaCopy class
    public int? CurrentLocationZoneId { get; set; }
    public int? HomeLocationZoneId { get; set; }

    // Add these navigation properties
    public virtual LocationZone? CurrentLocationZone { get; set; }
    public virtual LocationZone? HomeLocationZone { get; set; }

    public virtual ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();

    public virtual Media Media { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
