using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaService _mediaService;
        public MediaController(IMediaService mediaService)
        {
            _mediaService = mediaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMedia([FromQuery] bool includeCopies = false)
        {
            try
            {
                var media = await _mediaService.GetAllMediaAsync(includeCopies);
                return Ok(media);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


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