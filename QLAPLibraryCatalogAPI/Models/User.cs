using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string? Username { get; set; }

    public string PasswordHash { get; set; } = null!;

    public bool? EmailVerified { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();

    public virtual ICollection<MediaCopy> MediaCopies { get; set; } = new List<MediaCopy>();

    public virtual UserPreferences? UserPreferences { get; set; }
}
