using Microsoft.AspNetCore.Mvc;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    [ApiController]
    [Route("api/BorrowRequest")]
    public class BorrowRequestsController : ControllerBase
    {
        private readonly IBorrowRequestService _borrowRequestsService;
        public BorrowRequestsController(IBorrowRequestService borrowRequestsService)
        {
           _borrowRequestsService = borrowRequestsService; 
        }

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

        // // POST api/borrowrequests/{id}/return
        // [HttpPost("{requestId}/return")]
        // public async Task<IActionResult> ReturnLoan(int requestId, [FromBody] ReturnLoanDto dto)
        // {
        //     try
        //     {
        //         var loan = await _borrowRequestsService.MarkReturnedAsync(requestId, dto);
        //         return loan == null ? NotFound() : Ok(loan);
        //     }
        //     catch (InvalidOperationException ioe)
        //     {
        //         return BadRequest(new { error = ioe.Message });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }
    }
}