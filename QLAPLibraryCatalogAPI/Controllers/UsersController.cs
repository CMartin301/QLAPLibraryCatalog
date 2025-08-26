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
        private readonly IAuthService _authService;
        public UsersController(IUsersService usersService, IAuthService authService)
        {
            _usersService = usersService;
            _authService = authService;
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


        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var createdUser = await _usersService.CreateUserAsync(createUserDto);
                return CreatedAtAction(nameof(GetUserById), new { userId = createdUser.UserId }, createdUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

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


        // [HttpPut("{userId}")]
        // public async Task<IActionResult> UpdateUser(int userId, [FromBody] CreateUserDto updateUserDto)
        // {
        //     try
        //     {
        //         if (!ModelState.IsValid) return BadRequest(ModelState);

        //         var updatedUser = await _usersService.UpdateUserAsync(userId, updateUserDto);
        //         if (updatedUser == null) return NotFound();

        //         return Ok(updatedUser);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }

        [HttpPut("{userId}/preferences")]
        public async Task<IActionResult> UpdateUserPreferences(int userId, [FromBody] UserPreferencesDto preferencesDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var updatedPreferences = await _usersService.UpdateUserPreferencesAsync(userId, preferencesDto);
                if (updatedPreferences == null) return NotFound();

                return Ok(updatedPreferences);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var authResult = await _authService.AuthenticateAsync(loginDto);
                if (authResult == null) return Unauthorized(new { error = "Invalid credentials" });

                return Ok(authResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeactivateUser(int userId)
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
        public async Task<IActionResult> ReactivateUser(int userId)
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