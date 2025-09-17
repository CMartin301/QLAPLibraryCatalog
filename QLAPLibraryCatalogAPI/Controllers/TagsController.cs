using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    /// <summary>
    /// Controller for all tag functions
    /// </summary>
    [Authorize] 
    [ApiController]
    [Route("api/Tag")]
    public class TagsController : ControllerBase
    {
        private readonly ITagsService _tagsService;
        /// <summary> Constructor </summary>
        public TagsController(ITagsService tagsService)
        {
           _tagsService = tagsService; 
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
        /// <summary>
        ///  Gets all tags
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetTags()
        {
            try
            {
                var items = await _tagsService.GetTagsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

    }
}