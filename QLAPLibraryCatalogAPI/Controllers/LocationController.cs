using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLAPLibraryCatalogAPI.Services;
using System.Security.Claims;


/// <summary>
/// Controller for dashboard data
/// </summary>
[Authorize] 
[ApiController]
[Route("api/Location")]
public class LocationController : ControllerBase
{
    private readonly ILocationsService _locationsService;

    /// <summary> Constructor </summary>
    public LocationController(ILocationsService locationsService)
    {
        _locationsService = locationsService;
    }    /// <summary>
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
    /// <summary>
    /// Gets all location zones
    /// </summary>
    /// <returns></returns>
    [HttpGet("Zone")]
    public async Task<IActionResult> GetLocationZones()
    {
        // var userId = GetUserId();
        var locationZones = await _locationsService.GetLocationZonesAsync();
        return Ok(locationZones);
    }
}
