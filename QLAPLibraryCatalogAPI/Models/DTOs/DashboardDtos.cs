public class DashboardStatsDto
{
    public int TotalBooks { get; set; }
    public int ActiveLoans { get; set; }
    public int PendingRequests { get; set; }
    public int OverdueItems { get; set; }
}

public class RecentActivityDto
{
    public int LoanId { get; set; }
    public string MediaTitle { get; set; } = string.Empty;
    public string ActivityType { get; set; } = string.Empty;
    public DateTime? ActivityDate { get; set; } // changed to nullable
}


public class UpcomingDueDateDto
{
    public int LoanId { get; set; }
    public string MediaTitle { get; set; } = string.Empty;
    public DateOnly DueDate { get; set; }
    public bool IsOverdue { get; set; }
}
