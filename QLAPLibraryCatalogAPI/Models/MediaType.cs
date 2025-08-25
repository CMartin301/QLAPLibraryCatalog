using System;
using System.Collections.Generic;

namespace QLAPLibraryCatalogAPI.Models;

public partial class MediaType
{
    public int MediaTypeId { get; set; }

    public string Name { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Medium> Media { get; set; } = new List<Medium>();
}
