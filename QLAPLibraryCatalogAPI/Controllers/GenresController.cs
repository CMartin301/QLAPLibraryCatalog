using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    /// <summary>
    /// Controller for genre management operations
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GenresController : ControllerBase
    {
        private readonly IGenresService _genresService;

        /// <summary>Constructor</summary>
        public GenresController(IGenresService genresService)
        {
            _genresService = genresService;
        }

        /// <summary>
        /// Returns userID from authentication scheme/JWT
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
        /// Gets all active genres
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetGenres()
        {
            try
            {
                var genres = await _genresService.GetActiveGenresAsync();
                return Ok(genres);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets all genres (including inactive)
        /// </summary>
        /// <returns></returns>
        [HttpGet("All")]
        public async Task<IActionResult> GetAllGenres()
        {
            try
            {
                var genres = await _genresService.GetAllGenresAsync();
                return Ok(genres);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets genre by ID
        /// </summary>
        /// <param name="genreId"></param>
        /// <returns></returns>
        [HttpGet("{genreId}")]
        public async Task<IActionResult> GetGenreById(int genreId)
        {
            try
            {
                var genre = await _genresService.GetGenreByIdAsync(genreId);
                if (genre == null) return NotFound();

                return Ok(genre);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Creates a new genre
        /// </summary>
        /// <param name="createGenreDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateGenre([FromBody] CreateGenreDto createGenreDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var userId = GetUserId();
                var createdGenre = await _genresService.CreateGenreAsync(userId, createGenreDto);
                
                return CreatedAtAction(nameof(GetGenreById), 
                    new { genreId = createdGenre.GenreId }, 
                    createdGenre);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Updates an existing genre
        /// </summary>
        /// <param name="genreId"></param>
        /// <param name="updateGenreDto"></param>
        /// <returns></returns>
        [HttpPut("{genreId}")]
        public async Task<IActionResult> UpdateGenre(int genreId, [FromBody] UpdateGenreDto updateGenreDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var userId = GetUserId();
                var updatedGenre = await _genresService.UpdateGenreAsync(genreId, userId, updateGenreDto);
                
                if (updatedGenre == null) return NotFound();

                return Ok(updatedGenre);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Deactivates a genre
        /// </summary>
        /// <param name="genreId"></param>
        /// <returns></returns>
        [HttpDelete("{genreId}")]
        public async Task<IActionResult> DeactivateGenre(int genreId)
        {
            try
            {
                var result = await _genresService.DeactivateGenreAsync(genreId);
                if (!result) return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Reactivates a genre
        /// </summary>
        /// <param name="genreId"></param>
        /// <returns></returns>
        [HttpPatch("{genreId}/Reactivate")]
        public async Task<IActionResult> ReactivateGenre(int genreId)
        {
            try
            {
                var result = await _genresService.ReactivateGenreAsync(genreId);
                if (!result) return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Adds a genre to a media item
        /// </summary>
        /// <param name="genreId"></param>
        /// <param name="mediaId"></param>
        /// <returns></returns>
        [HttpPost("{genreId}/Media/{mediaId}")]
        public async Task<IActionResult> AddMediaGenre(int genreId, int mediaId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _genresService.AddMediaGenreAsync(userId, mediaId, genreId);
                
                if (!result) 
                    return BadRequest(new { error = "Genre-media relationship already exists or invalid IDs provided." });

                return Ok(new { message = "Genre successfully added to media." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Removes a genre from a media item
        /// </summary>
        /// <param name="genreId"></param>
        /// <param name="mediaId"></param>
        /// <returns></returns>
        [HttpDelete("{genreId}/Media/{mediaId}")]
        public async Task<IActionResult> RemoveMediaGenre(int genreId, int mediaId)
        {
            try
            {
                var result = await _genresService.RemoveMediaGenreAsync(mediaId, genreId);
                if (!result) return NotFound(new { error = "Genre-media relationship not found." });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}