using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    /// <summary>
    /// Controller for all borrow request functions
    /// </summary>
    [Authorize] 
    [ApiController]
    [Route("api/BorrowRequest")]
    public class BorrowRequestsController : ControllerBase
    {
        private readonly IBorrowRequestService _borrowRequestsService;
        /// <summary> Constructor </summary>
        public BorrowRequestsController(IBorrowRequestService borrowRequestsService)
        {
           _borrowRequestsService = borrowRequestsService; 
        }
        /// <summary>
        /// Returns userID from authentication scheme/ JWT
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
        ///  Gets all borrow requests
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetBorrowRequests()
        {
            try
            {
                var items = await _borrowRequestsService.GetBorrowRequestsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        /// Gets all borrow requests where the given userId is the borrower
        /// </summary>
        /// <param name="borrowerId"></param>
        /// <returns></returns>
        [HttpGet("Borrower/{borrowerId}")]
        public async Task<IActionResult> GetBorrowRequestsForBorrower(int borrowerId)
        {
            try
            {
                var items = await _borrowRequestsService.GetBorrowRequestsForBorrowerAsync(borrowerId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        /// Gets all borrow requests where the given ID is the lender
        /// </summary>
        /// <param name="lenderId"></param>
        /// <returns></returns>
        [HttpGet("Lender/{lenderId}")]
        public async Task<IActionResult> GetBorrowRequestsForLender(int lenderId)
        {
            try
            {
                var items = await _borrowRequestsService.GetBorrowRequestsForLenderAsync(lenderId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        /// Gets a specific borrow request by ID
        /// </summary>
        /// <param name="requestId"></param>
        /// <returns></returns>
        [HttpGet("{requestId}")]
        public async Task<IActionResult> GetBorrowRequestById(int requestId)
        {
            try
            {
                var borrowRequest = await _borrowRequestsService.GetBorrowRequestByIdAsync(requestId);
                if (borrowRequest == null) return NotFound();

                return Ok(borrowRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        /// Creates a new borrow request
        /// </summary>
        /// <param name="createBorrowRequestDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateBorrowRequest([FromBody] CreateBorrowRequestDto createBorrowRequestDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var createdRequest = await _borrowRequestsService.CreateBorrowRequestAsync(createBorrowRequestDto);
                return CreatedAtAction(nameof(GetBorrowRequestById), new { requestId = createdRequest.RequestId }, createdRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Approves an existing borrow request
        /// </summary>
        /// <param name="requestId"></param>
        /// <returns></returns>
        // POST api/borrowrequests/{id}/deny
        [HttpPost("{requestId}/Approve")]
        public async Task<IActionResult> ApproveBorrowRequest(int requestId)
        {
            try
            {
                var approvedRequest = await _borrowRequestsService.ApproveBorrowRequestAsync(requestId);
                if (approvedRequest == null) return NotFound();
                
                return Ok(approvedRequest);
            }
            catch (InvalidOperationException ioe)
            {
                return BadRequest(new { error = ioe.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        /// Denies an existing borrow request
        /// </summary>
        /// <param name="requestId"></param>
        /// <param name="denyBorrowRequestDto"></param>
        /// <returns></returns>
        // POST api/borrowrequests/{id}/deny
        [HttpPost("{requestId}/Deny")]
        public async Task<IActionResult> DenyBorrowRequest(int requestId, [FromBody] DenyBorrowRequestDto denyBorrowRequestDto)
        {
            try
            {
                var deniedRequest = await _borrowRequestsService.DenyBorrowRequestAsync(requestId, denyBorrowRequestDto);
                if (deniedRequest == null) return NotFound();
                
                return Ok(deniedRequest);
            }
            catch (InvalidOperationException ioe)
            {
                return BadRequest(new { error = ioe.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Cancels an existing borrow request
        /// </summary>
        /// <param name="requestId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        // POST api/borrowrequests/{id}/cancel?actorUserId=...
        [HttpPost("{requestId}/Cancel")]
        public async Task<IActionResult> CancelBorrowRequest(int requestId, [FromQuery] int userId)
        {
            try
            {
                var ok = await _borrowRequestsService.CancelBorrowRequestAsync(requestId, userId);
                return ok ? NoContent() : NotFound();
            }
            catch (InvalidOperationException ioe)
            {
                return BadRequest(new { error = ioe.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

    }
}