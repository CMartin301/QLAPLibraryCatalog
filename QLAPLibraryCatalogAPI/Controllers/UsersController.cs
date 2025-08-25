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
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;
        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _usersService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            try
            {
                var media = await _usersService.GetUserByIdAsync(userId);
                if (media == null) return NotFound();

                return Ok(media);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // [HttpPost]
        // public async Task<IActionResult> CreateUsers([FromBody] CreateUserDto createUserDto)
        // {
        //     try
        //     {
        //         if (!ModelState.IsValid) return BadRequest(ModelState);

        //         var createdUser = await _usersService.CreateUserAsync(createUserDto);
        //         return CreatedAtAction(nameof(GetUserById), new { mediaId = createdUser.UserId }, createdUser);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }

        // [HttpPut("{mediaId}")]
        // public async Task<IActionResult> UpdateUser(int mediaId, [FromBody] CreateUserDto updateUserDto)
        // {
        //     try
        //     {
        //         if (!ModelState.IsValid) return BadRequest(ModelState);

        //         var updatedUser = await _usersService.UpdateUserAsync(mediaId, updateUserDto);
        //         if (updatedUser == null) return NotFound();

        //         return Ok(updatedUser);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }

        // [HttpDelete("{mediaId}")]
        // public async Task<IActionResult> DeleteUser(int mediaId)
        // {
        //     try
        //     {
        //         var result = await _usersService.DeleteUserAsync(mediaId);
        //         if (!result) return NotFound();

        //         return NoContent();
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeactivateMediaType(int userId)
        {
            try
            {
                var result = await _usersService.DeactivateUserAsync(userId);
                if (!result) return NotFound();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPatch("{userId}/Reactivate")]
        public async Task<IActionResult> ReactivateMediaType(int userId)
        {
            try
            {
                var result = await _usersService.ReactivateUserAsync(userId);
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