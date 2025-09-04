using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    [ApiController]
    [Route("api/MediaCopy")]
    public class MediaCopiesController : ControllerBase
    {
        private readonly IMediaCopiesService _mediaCopiesService;
        public MediaCopiesController(IMediaCopiesService mediaCopiesService)
        {
            _mediaCopiesService = mediaCopiesService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMediaCopies()
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