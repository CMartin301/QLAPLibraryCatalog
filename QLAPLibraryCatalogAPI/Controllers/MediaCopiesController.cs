using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    /// <summary>
    /// Controller for media copy functions
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/MediaCopy")]
    public class MediaCopiesController : ControllerBase
    {
        private readonly IMediaCopiesService _mediaCopiesService;
        /// <summary> Constructor </summary>
        public MediaCopiesController(IMediaCopiesService mediaCopiesService)
        {
            _mediaCopiesService = mediaCopiesService;
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
        /// Gets all media copies
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAllMediaCopies()
        {
            try
            {
                var media = await _mediaCopiesService.GetAllMediaCopiesAsync();
                // return Ok(media);
                return Ok(new { data = media });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        /// Gets all copies for some media
        /// </summary>
        /// <returns></returns>
        [HttpGet("Media/{mediaId}")]
        public async Task<IActionResult> GetMediaCopiesByMediaID(int mediaId)
        {
            try
            {
                var media = await _mediaCopiesService.GetMediaCopiesByMediaIDAsync(mediaId);
                return Ok(media);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets media copy by ID
        /// </summary>
        /// <param name="mediaCopyId"></param>
        /// <returns></returns>
        [HttpGet("{mediaCopyId}")]
        public async Task<IActionResult> GetMediaCopyById(int mediaCopyId)
        {
            try
            {
                var mediaCopy = await _mediaCopiesService.GetMediaCopyByIdAsync(mediaCopyId);
                if (mediaCopy == null) return NotFound();

                return Ok(mediaCopy);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Creates new media copy
        /// </summary>
        /// <param name="createMediaCopyDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateMediaCopy([FromBody] CreateMediaCopyDto createMediaCopyDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var createdMediaCopy = await _mediaCopiesService.CreateMediaCopyAsync(createMediaCopyDto);
                return CreatedAtAction(nameof(GetMediaCopyById), new { mediaCopyId = createdMediaCopy.CopyId }, createdMediaCopy);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        /// <summary>
        /// Gets media info and copy info for all of a user's media copies
        /// </summary>
        /// <returns></returns>
        [HttpGet("User")]
        public async Task<IActionResult> GetUserMediaCopies()
        {
            try
            {
                var userID = GetUserId();
                var media = await _mediaCopiesService.GetUserMediaCopiesAsync(userID);
                // return Ok(media);
                return Ok(new { data = media });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

    }
}