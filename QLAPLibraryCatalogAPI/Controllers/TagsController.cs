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

        /// <summary>
        ///  Gets tag by ID
        /// </summary>
        /// <param name="tagID"></param>
        /// <returns></returns>
        [HttpGet("{tagID}")]
        public async Task<IActionResult> GetTagByID(int tagID)
        {
            try
            {
                var items = await _tagsService.GetTagByIDAsync(tagID);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        ///  Adds tag 
        /// </summary>
        /// <param name="createTagDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> AddMediaTag([FromBody] CreateTagDto createTagDto)
        {
            try
            {
                int userID = GetUserId();
                var items = await _tagsService.AddTagAsync(userID, createTagDto);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        ///  Adds tag to a media object, adds mediaTag association
        /// </summary>
        /// <param name="tagID"></param>
        /// <param name="mediaID"></param>
        /// <returns></returns>
        [HttpPost("{tagID}/Media/{mediaID}")]
        public async Task<IActionResult> AddMediaTag(int tagID, int mediaID)
        {
            try
            {
                int userID = GetUserId();
                var items = await _tagsService.AddMediaTagAsync(userID, mediaID, tagID);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        /// <summary>
/// Gets all genre tags (tags where IsGenre = true)
/// </summary>
/// <returns></returns>
[HttpGet("Genres")]
public async Task<IActionResult> GetGenres()
{
    try
    {
        var items = await _tagsService.GetGenresAsync();
        return Ok(items);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.Message });
    }
}

/// <summary>
/// Updates an existing tag
/// </summary>
/// <param name="tagId"></param>
/// <param name="updateTagDto"></param>
/// <returns></returns>
[HttpPut("{tagId}")]
public async Task<IActionResult> UpdateTag(int tagId, [FromBody] UpdateTagDto updateTagDto)
{
    try
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        int userId = GetUserId();
        var updatedTag = await _tagsService.UpdateTagAsync(tagId, userId, updateTagDto);
        if (updatedTag == null) return NotFound();
        
        return Ok(updatedTag);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.Message });
    }
}

/// <summary>
/// Deletes a tag
/// </summary>
/// <param name="tagId"></param>
/// <returns></returns>
[HttpDelete("{tagId}")]
public async Task<IActionResult> DeleteTag(int tagId)
{
    try
    {
        var result = await _tagsService.DeleteTagAsync(tagId);
        if (!result) return NotFound();
        
        return NoContent();
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.Message });
    }
}

    }
}