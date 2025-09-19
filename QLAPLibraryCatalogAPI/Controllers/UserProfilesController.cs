using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    /// <summary>
    /// Controller for user profile management operations
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/UserProfile")]
    public class UserProfilesController : ControllerBase
    {
        private readonly IUserProfilesService _userProfilesService;

        /// <summary>Constructor</summary>
        public UserProfilesController(IUserProfilesService userProfilesService)
        {
            _userProfilesService = userProfilesService;
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
        /// Gets the current user's profile
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userId = GetUserId();
                var profile = await _userProfilesService.GetUserProfileAsync(userId);
                
                if (profile == null) return NotFound(new { message = "Profile not found" });

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets comprehensive user information including profile for the current user
        /// </summary>
        /// <returns></returns>
        [HttpGet("Complete")]
        public async Task<IActionResult> GetMyCompleteProfile()
        {
            try
            {
                var userId = GetUserId();
                var userWithProfile = await _userProfilesService.GetUserWithProfileAsync(userId);
                
                if (userWithProfile == null) return NotFound(new { message = "User not found" });

                return Ok(userWithProfile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets user profile by user ID (for viewing other users' public profiles)
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("User/{userId}")]
        public async Task<IActionResult> GetUserProfile(int userId)
        {
            try
            {
                var profile = await _userProfilesService.GetUserProfileAsync(userId);
                
                if (profile == null) return NotFound(new { message = "Profile not found" });

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets comprehensive user information by user ID
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("User/{userId}/Complete")]
        public async Task<IActionResult> GetUserWithProfile(int userId)
        {
            try
            {
                var userWithProfile = await _userProfilesService.GetUserWithProfileAsync(userId);
                
                if (userWithProfile == null) return NotFound(new { message = "User not found" });

                return Ok(userWithProfile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Creates or updates the current user's profile
        /// </summary>
        /// <param name="profileDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdateMyProfile([FromBody] CreateOrUpdateUserProfileDto profileDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var userId = GetUserId();
                var profile = await _userProfilesService.CreateOrUpdateUserProfileAsync(userId, profileDto);

                return Ok(profile);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Updates a specific user's profile (admin functionality)
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="profileDto"></param>
        /// <returns></returns>
        [HttpPut("User/{userId}")]
        public async Task<IActionResult> UpdateUserProfile(int userId, [FromBody] CreateOrUpdateUserProfileDto profileDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                // Optional: Add authorization check here for admin users
                var currentUserId = GetUserId();
                if (currentUserId != userId)
                {
                    // You might want to check if current user is admin
                    return Forbid("You can only update your own profile");
                }

                var profile = await _userProfilesService.CreateOrUpdateUserProfileAsync(userId, profileDto);

                return Ok(profile);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Deletes the current user's profile
        /// </summary>
        /// <returns></returns>
        [HttpDelete]
        public async Task<IActionResult> DeleteMyProfile()
        {
            try
            {
                var userId = GetUserId();
                var result = await _userProfilesService.DeleteUserProfileAsync(userId);
                
                if (!result) return NotFound(new { message = "Profile not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets all tags for the current user
        /// </summary>
        /// <returns></returns>
        [HttpGet("Tags")]
        public async Task<IActionResult> GetMyUserTags()
        {
            try
            {
                var userId = GetUserId();
                var tags = await _userProfilesService.GetUserTagsAsync(userId);

                return Ok(tags);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets all tags for a specific user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("User/{userId}/Tags")]
        public async Task<IActionResult> GetUserTags(int userId)
        {
            try
            {
                var tags = await _userProfilesService.GetUserTagsAsync(userId);

                return Ok(tags);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Adds a tag to the current user
        /// </summary>
        /// <param name="tagId"></param>
        /// <returns></returns>
        [HttpPost("Tags/{tagId}")]
        public async Task<IActionResult> AddTagToMyProfile(int tagId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _userProfilesService.AddUserTagAsync(userId, tagId);

                if (!result) 
                    return BadRequest(new { error = "Tag already exists for user or invalid tag/user ID" });

                return Ok(new { message = "Tag successfully added to user profile" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Adds a tag to a specific user (admin functionality)
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="tagId"></param>
        /// <returns></returns>
        [HttpPost("User/{userId}/Tags/{tagId}")]
        public async Task<IActionResult> AddTagToUser(int userId, int tagId)
        {
            try
            {
                // Optional: Add authorization check here for admin users
                var currentUserId = GetUserId();
                if (currentUserId != userId)
                {
                    // You might want to check if current user is admin
                    return Forbid("You can only modify your own profile tags");
                }

                var result = await _userProfilesService.AddUserTagAsync(userId, tagId);

                if (!result) 
                    return BadRequest(new { error = "Tag already exists for user or invalid tag/user ID" });

                return Ok(new { message = "Tag successfully added to user profile" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Removes a tag from the current user
        /// </summary>
        /// <param name="tagId"></param>
        /// <returns></returns>
        [HttpDelete("Tags/{tagId}")]
        public async Task<IActionResult> RemoveTagFromMyProfile(int tagId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _userProfilesService.RemoveUserTagAsync(userId, tagId);

                if (!result) return NotFound(new { error = "User tag relationship not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Removes a tag from a specific user (admin functionality)
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="tagId"></param>
        /// <returns></returns>
        [HttpDelete("User/{userId}/Tags/{tagId}")]
        public async Task<IActionResult> RemoveTagFromUser(int userId, int tagId)
        {
            try
            {
                // Optional: Add authorization check here for admin users
                var currentUserId = GetUserId();
                if (currentUserId != userId)
                {
                    // You might want to check if current user is admin
                    return Forbid("You can only modify your own profile tags");
                }

                var result = await _userProfilesService.RemoveUserTagAsync(userId, tagId);

                if (!result) return NotFound(new { error = "User tag relationship not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}