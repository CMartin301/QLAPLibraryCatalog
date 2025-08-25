using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models;

public partial class UserPreferences
{
    public int PreferenceId { get; set; }

    public int UserId { get; set; }

    public int? DefaultLoanDays { get; set; }

    public bool? AutoApproveRequests { get; set; }

    public bool? EmailNotifications { get; set; }

    public bool? SmsNotifications { get; set; }

    public string? NotificationSettings { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
