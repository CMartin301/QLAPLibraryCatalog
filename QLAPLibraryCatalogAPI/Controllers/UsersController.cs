using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;
using System.Security.Claims;

namespace QLAPLibraryCatalogAPI.Controllers
{
    /// <summary>
    /// Controller for all user functions
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;
        private readonly IAuthService _authService;
        /// <summary>
        /// Constructor
        /// </summary>
        public UsersController(IUsersService usersService, IAuthService authService)
        {
            _usersService = usersService;
            _authService = authService;
        }

        /// <summary>
        /// Gets all users
        /// </summary>
        /// <returns></returns>
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

        /// <summary>
        /// Gets user by ID
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            try
            {
                var user = await _usersService.GetUserByIdAsync(userId);
                if (user == null) return NotFound();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Creates new user
        /// </summary>
        /// <param name="createUserDto"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Updates existing user preferences
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="preferencesDto"></param>
        /// <returns></returns>
        [HttpPut("{userId}/preferences")]
        public async Task<IActionResult> UpdateUserPreferences(int userId, [FromBody] UserPreferencesDto preferencesDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);


                // Get the authenticated user's ID from the JWT token
                var authenticatedUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(authenticatedUserIdClaim) || !int.TryParse(authenticatedUserIdClaim, out int authenticatedUserId))
                {
                    return Unauthorized(new { error = "Invalid token" });
                }

                // Check if the authenticated user matches the userId in the route
                if (authenticatedUserId != userId)
                {
                    return Forbid(); // 403 Forbidden - user is authenticated but not authorized for this resource
                }

                var updatedPreferences = await _usersService.UpdateUserPreferencesAsync(userId, preferencesDto);
                if (updatedPreferences == null) return NotFound();

                return Ok(updatedPreferences);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Returns JWT for user
        /// </summary>
        /// <param name="loginDto"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Deactivates existing user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpDelete("{userId}/Deactivate")]
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
        /// <summary>
        /// Reactivates existing user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
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