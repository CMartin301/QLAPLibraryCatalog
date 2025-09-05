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