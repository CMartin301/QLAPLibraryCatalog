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
    public class UserMediaCopiesController : ControllerBase
    {
        private readonly IUserMediaCopiesService _userMediaCopiesService;
        public UserMediaCopiesController(IUserMediaCopiesService userMediaCopiesService)
        {
            _userMediaCopiesService = userMediaCopiesService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserMediaCopies()
        {
            try
            {
                var media = await _userMediaCopiesService.GetAllUserMediaCopiesAsync();
                // return Ok(media);
                return Ok(new { data = media });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        // [HttpGet("{mediaId}")]
        // public async Task<IActionResult> GetMediaById(int mediaId)
        // {
        //     try
        //     {
        //         var media = await _userMediaCopiesService.GetMediaByIdAsync(mediaId);
        //         if (media == null) return NotFound();
                
        //         return Ok(media);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }
        
        // [HttpPost]
        // public async Task<IActionResult> CreateMedia([FromBody] CreateMediaDto createMediaDto)
        // {
        //     try
        //     {
        //         if (!ModelState.IsValid) return BadRequest(ModelState);
                
        //         var createdMedia = await _userMediaCopiesService.CreateMediaAsync(createMediaDto);
        //         return CreatedAtAction(nameof(GetMediaById), new { mediaId = createdMedia.MediaId }, createdMedia);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }
        
        // [HttpPut("{mediaId}")]
        // public async Task<IActionResult> UpdateMedia(int mediaId, [FromBody] CreateMediaDto updateMediaDto)
        // {
        //     try
        //     {
        //         if (!ModelState.IsValid) return BadRequest(ModelState);
                
        //         var updatedMedia = await _userMediaCopiesService.UpdateMediaAsync(mediaId, updateMediaDto);
        //         if (updatedMedia == null) return NotFound();
                
        //         return Ok(updatedMedia);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }
        
        // [HttpDelete("{mediaId}")]
        // public async Task<IActionResult> DeleteMedia(int mediaId)
        // {
        //     try
        //     {
        //         var result = await _userMediaCopiesService.DeleteMediaAsync(mediaId);
        //         if (!result) return NotFound();
                
        //         return NoContent();
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }

    }
}