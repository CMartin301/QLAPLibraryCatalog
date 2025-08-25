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
                var mediaTypes = await _mediaTypeService.GetActiveMediaTypesAsync();
                return Ok(mediaTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpGet("{mediaTypeId}")]
        public async Task<IActionResult> GetMediaTypeById(int mediaTypeId)
        {
            try
            {
                var mediaType = await _mediaTypeService.GetMediaTypeByIdAsync(mediaTypeId);
                if (mediaType == null) return NotFound();
                
                return Ok(mediaType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateMediaType([FromBody] CreateMediaTypeDto createMediaTypeDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                
                var createdMediaType = await _mediaTypeService.CreateMediaTypeAsync(createMediaTypeDto);
                return CreatedAtAction(nameof(GetMediaTypeById), new { mediaTypeId = createdMediaType.MediaTypeId }, createdMediaType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        [HttpPut("{mediaTypeId}")]
        public async Task<IActionResult> UpdateMediaType(int mediaTypeId, [FromBody] CreateMediaTypeDto updateMediaTypeDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                
                var updatedMediaType = await _mediaTypeService.UpdateMediaTypeAsync(mediaTypeId, updateMediaTypeDto);
                if (updatedMediaType == null) return NotFound();
                
                return Ok(updatedMediaType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        [HttpDelete("{mediaTypeId}")]
        public async Task<IActionResult> DeactivateMediaType(int mediaTypeId)
        {
            try
            {
                var result = await _mediaTypeService.DeactivateMediaTypeAsync(mediaTypeId);
                if (!result) return NotFound();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPatch("{mediaTypeId}/Reactivate")]
        public async Task<IActionResult> ReactivateMediaType(int mediaTypeId)
        {
            try
            {
                var result = await _mediaTypeService.ReactivateMediaTypeAsync(mediaTypeId);
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