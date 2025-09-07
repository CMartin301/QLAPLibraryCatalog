using Microsoft.AspNetCore.Mvc;
using QLAPLibraryCatalogAPI.Services;

[ApiController]
[Route("api/Dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("Stats")]
    public async Task<IActionResult> GetStats(int userId)
    {
        var stats = await _dashboardService.GetStatsAsync(userId);
        return Ok(stats);
    }

    [HttpGet("RecentActivity")]
    public async Task<IActionResult> GetRecentActivity(int userId, int count = 5)
    {
        var activity = await _dashboardService.GetRecentActivityAsync(userId, count);
        return Ok(activity);
    }

    [HttpGet("UpcomingDueDates")]
    public async Task<IActionResult> GetUpcomingDueDates(int userId, int daysAhead = 7)
    {
        var dueDates = await _dashboardService.GetUpcomingDueDatesAsync(userId, daysAhead);
        return Ok(dueDates);
    }
}
