using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    /// <summary>
    /// Controller for all media functions
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaService _mediaService;
        /// <summary>
        /// Constructor
        /// </summary>
        public MediaController(IMediaService mediaService)
        {
            _mediaService = mediaService;
        }
        /// <summary>
        /// Gets all media with option search and option to include media copies
        /// </summary>
        /// <param name="includeCopies"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetMedia([FromQuery] bool includeCopies = false, [FromQuery] string? search = null)
        {
            try
            {
                var media = await _mediaService.GetAllMediaAsync(includeCopies, search);
                return Ok(media);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// 
        /// Gets media by ID with option to include media copies
        /// </summary>
        /// <param name="mediaId"></param>
        /// <param name="includeCopies"></param>
        /// <returns></returns>
        [HttpGet("{mediaId}")]
        public async Task<IActionResult> GetMediaById(int mediaId, [FromQuery] bool includeCopies = false)
        {
            try
            {
                var media = await _mediaService.GetMediaByIdAsync(mediaId, includeCopies);
                if (media == null) return NotFound();
                
                return Ok(media);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        /// <summary>
        /// Gets all media a user owns with an option to include media copies the user owns
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="includeCopies"></param>
        /// <returns></returns>
        [HttpGet("User/{userId}")]
        public async Task<IActionResult> GetUserMedia(int userId, [FromQuery] bool includeCopies = false)
        {
            try
            {
                var media = await _mediaService.GetUserMediaAsync(userId, includeCopies);
                return Ok(media);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        /// <summary>
        /// Creates a new media object
        /// </summary>
        /// <param name="createMediaDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateMedia([FromBody] CreateMediaDto createMediaDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                
                var createdMedia = await _mediaService.CreateMediaAsync(createMediaDto);
                return CreatedAtAction(nameof(GetMediaById), new { mediaId = createdMedia.MediaId }, createdMedia);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        /// <summary>
        /// Updates an existing media object
        /// </summary>
        /// <param name="mediaId"></param>
        /// <param name="updateMediaDto"></param>
        /// <returns></returns>
        [HttpPut("{mediaId}")]
        public async Task<IActionResult> UpdateMedia(int mediaId, [FromBody] CreateMediaDto updateMediaDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                
                var updatedMedia = await _mediaService.UpdateMediaAsync(mediaId, updateMediaDto);
                if (updatedMedia == null) return NotFound();
                
                return Ok(updatedMedia);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        /// <summary>
        /// Deletes an existing media object
        /// </summary>
        /// <param name="mediaId"></param>
        /// <returns></returns>
        [HttpDelete("{mediaId}")]
        public async Task<IActionResult> DeleteMedia(int mediaId)
        {
            try
            {
                var result = await _mediaService.DeleteMediaAsync(mediaId);
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