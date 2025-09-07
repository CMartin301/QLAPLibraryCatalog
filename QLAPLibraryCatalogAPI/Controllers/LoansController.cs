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
        private readonly ILoansService _loansService;
        /// <summary> Constructor </summary>
        public LoansController(ILoansService LoansService)
        {
            _loansService = LoansService;
        }
        #region Get Loans without Details
        /// <summary>
        ///  Gets all loans without details
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetLoans()
        {
            try
            {
                var items = await _loansService.GetLoansAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        /// Gets all loans where the user is the borrower without details
        /// </summary>
        [HttpGet("User/Borrowed")]
        public async Task<IActionResult> GetLoansBorrowedByUser(int userId)
        {
            try
            {
                var items = await _loansService.GetLoansBorrowedByUserAsync(userId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets all loans where the user owns the media (lender) without details
        /// </summary>
        [HttpGet("User/Lent")]
        public async Task<IActionResult> GetLoansOfUserMedia(int userId)
        {
            try
            {
                var items = await _loansService.GetLoansOfUserMediaAsync(userId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets a specific loan by ID without details
        /// </summary>
        /// <param name="loanId"></param>
        /// <returns></returns>
        [HttpGet("{loanId}")]
        public async Task<IActionResult> GetLoanById(int loanId)
        {
            try
            {
                var Loans = await _loansService.GetLoanByIdAsync(loanId);
                if (Loans == null) return NotFound();

                return Ok(Loans);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        #endregion

        #region Get Loans with Details

        /// <summary>
        /// Gets all loans where the user is the borrower with full details for display
        /// </summary>
        [HttpGet("User/Borrowed/Details")]
        public async Task<IActionResult> GetLoansBorrowedByUserWithDetails(int userId)
        {
            try
            {
                var items = await _loansService.GetLoansBorrowedByUserWithDetailsAsync(userId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets all loans where the user owns the media (lender) with full details for display
        /// </summary>
        [HttpGet("User/Lent/Details")]
        public async Task<IActionResult> GetLoansOfUserMediaWithDetails(int userId)
        {
            try
            {
                var items = await _loansService.GetLoansOfUserMediaWithDetailsAsync(userId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Gets a specific loan by ID with full details for display
        /// </summary>
        /// <param name="loanId"></param>
        /// <returns></returns>
        [HttpGet("{loanId}/Details")]
        public async Task<IActionResult> GetLoanByIdWithDetails(int loanId)
        {
            try
            {
                var loan = await _loansService.GetLoanByIdWithDetailsAsync(loanId);
                if (loan == null) return NotFound();

                return Ok(loan);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        #endregion
        #region Loan Actions

        /// <summary>
        /// Extends due date of an existing Loan object
        /// </summary>
        /// <param name="loanId"></param>
        /// <param name="newDueDate"></param>
        /// <returns></returns>
        [HttpPut("{loanId}")]
        public async Task<IActionResult> ExtendLoanDueDate(int loanId, [FromBody] DateOnly? newDueDate)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var updatedLoan = await _loansService.ExtendLoan(loanId, newDueDate);
                if (updatedLoan == null) return NotFound();
                
                return Ok(updatedLoan);
            }
            catch (InvalidOperationException ex)
            {
                // Business rule violation: due date cannot be reduced
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        /// <summary>
        /// Adds loan return confirmation for either borrower or lender
        /// </summary>
        /// <param name="loanId"></param>
        /// <param name="isBorrower"></param>
        /// <param name="comment"></param>
        /// <returns></returns>
        [HttpPut("{loanId}/Return")]
        public async Task<IActionResult> ReturnLoan(int loanId, [FromQuery]bool isBorrower, [FromBody] string? comment)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var updatedLoan = await _loansService.ReturnLoan(loanId, isBorrower, comment);
                if (updatedLoan == null) return NotFound();
                
                return Ok(updatedLoan);
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
        
        #endregion

    }
}