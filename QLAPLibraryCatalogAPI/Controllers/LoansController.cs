using Microsoft.AspNetCore.Mvc;
using QLAPLibraryCatalogAPI.Models.DTOs;
using QLAPLibraryCatalogAPI.Services;

namespace QLAPLibraryCatalogAPI.Controllers
{
    /// <summary>
    /// Controller for all borrow request functions
    /// </summary>
    [ApiController]
    [Route("api/Loan")]
    public class LoansController : ControllerBase
    {
        private readonly ILoansService _LoansService;
        /// <summary>
        /// Constructor
        /// </summary>
        public LoansController(ILoansService LoansService)
        {
           _LoansService = LoansService; 
        }
        /// <summary>
        ///  Gets all loans
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetLoans()
        {
            try
            {
                var items = await _LoansService.GetLoansAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        /// Gets all loans where the user is the borrower
        /// </summary>
        [HttpGet("User/Borrowed")]
        public async Task<IActionResult> GetLoansBorrowedByUser(int userId)
        {
            try
            {
                var items = await _LoansService.GetLoansBorrowedByUserAsync(userId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets all loans where the user owns the media (lender)
        /// </summary>
        [HttpGet("User/Lent")]
        public async Task<IActionResult> GetLoansOfUserMedia(int userId)
        {
            try
            {
                var items = await _LoansService.GetLoansOfUserMediaAsync(userId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // /// <summary>
        // ///  Gets all loans for some user
        // /// </summary>
        // /// <returns></returns>
        // [HttpGet("User")]
        // public async Task<IActionResult> GetUserLoans(int userId)
        // {
        //     try
        //     {
        //         var items = await _LoansService.GetUserLoansAsync(userId);
        //         return Ok(items);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { error = ex.Message });
        //     }
        // }
        /// <summary>
        /// Gets a specific loan by ID
        /// </summary>
        /// <param name="loanId"></param>
        /// <returns></returns>
        [HttpGet("{loanId}")]
        public async Task<IActionResult> GetLoanById(int loanId)
        {
            try
            {
                var Loans = await _LoansService.GetLoanByIdAsync(loanId);
                if (Loans == null) return NotFound();

                return Ok(Loans);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


    }
}