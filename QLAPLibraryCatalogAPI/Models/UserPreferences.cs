using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models;

public partial class UserPreferences
{
    public int PreferenceId { get; set; }

    public int UserId { get; set; }

    public bool? EmailNotifications { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
