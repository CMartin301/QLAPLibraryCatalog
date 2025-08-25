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
    public class MediaTypesController : ControllerBase
    {
        // private readonly LibraryCatalogContext dbContext;
        // public MediaController(LibraryCatalogContext _context)
        // {
        //     dbContext = _context;
        // }
        private readonly IMediaTypeService _mediaTypeService;
        public MediaTypesController(IMediaTypeService mediaTypeService)
        {
            _mediaTypeService = mediaTypeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMediaTypes()
        {
            try
            {
                var mediaTypes = await _mediaTypeService.GetAllMediaTypesAsync();
                return Ok(mediaTypes);
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
        //         var media = await _mediaService.GetMediaByIdAsync(mediaId);
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
                
        //         var createdMedia = await _mediaService.CreateMediaAsync(createMediaDto);
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
                
        //         var updatedMedia = await _mediaService.UpdateMediaAsync(mediaId, updateMediaDto);
        //         if (updatedMedia == null) return NotFound();
                
        //         return Ok(updatedMedia);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }
        
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteMedia(int id)
        // {
        //     try
        //     {
        //         var result = await _mediaService.DeleteMediaAsync(id);
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