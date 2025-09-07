using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLAPLibraryCatalogAPI.Services;
using System.Security.Claims;


/// <summary>
/// Controller for dashboard data
/// </summary>
[Authorize] 
[ApiController]
[Route("api/Dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    /// <summary> Constructor </summary>
    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }
    /// <summary>
    /// Gets overview stats for the user
    /// </summary>
    /// <returns></returns>
    [HttpGet("Stats")]
    public async Task<IActionResult> GetStats()
    {
        var userId = GetUserId();
        var stats = await _dashboardService.GetStatsAsync(userId);
        return Ok(stats);
    }
    /// <summary>
    /// Gets user's recent activity
    /// </summary>
    /// <param name="count"></param>
    /// <returns></returns>
    [HttpGet("RecentActivity")]
    public async Task<IActionResult> GetRecentActivity(int count = 5)
    {
        var userId = GetUserId();
        var activity = await _dashboardService.GetRecentActivityAsync(userId, count);
        return Ok(activity);
    }
    /// <summary>
    /// Gets user's upcoming due dates
    /// </summary>
    /// <param name="daysAhead"></param>
    /// <returns></returns>
    [HttpGet("UpcomingDueDates")]
    public async Task<IActionResult> GetUpcomingDueDates(int daysAhead = 7)
    {
        var userId = GetUserId();
        var dueDates = await _dashboardService.GetUpcomingDueDatesAsync(userId, daysAhead);
        return Ok(dueDates);
    }
    /// <summary>
    /// Returns userID from authentication scheme/ JWT
    /// </summary>
    /// <returns></returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    [NonAction]
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("User ID claim not found in token.");
        
        return int.Parse(userIdClaim);
    }
}
