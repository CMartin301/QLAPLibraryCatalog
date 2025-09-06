using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary>
    /// Interface for LoansService
    /// </summary>
    public interface ILoansService
    {
#pragma warning disable 1591
        Task<IEnumerable<LoanDto>> GetLoansAsync();
        Task<IEnumerable<LoanDto>> GetLoansBorrowedByUserAsync(int userId);
        Task<IEnumerable<LoanDto>> GetLoansOfUserMediaAsync(int userId);
        Task<LoanDto?> GetLoanByIdAsync(int loanId);
        Task<IEnumerable<LoanWithDetailsDto>> GetLoansBorrowedByUserWithDetailsAsync(int userId);
        Task<IEnumerable<LoanWithDetailsDto>> GetLoansOfUserMediaWithDetailsAsync(int userId);
        Task<LoanWithDetailsDto?> GetLoanByIdWithDetailsAsync(int loanId);
#pragma warning restore 1591
    }
    /// <summary>
    /// LoansService - operations on/access to loans
    /// </summary>
    public class LoansService : ILoansService
    {
        private readonly LibraryCatalogContext _context;
        /// <summary> Constructor </summary>
        public LoansService(LibraryCatalogContext context) => _context = context;

        #region Loans Without Details
        /// <summary>
        /// Gets all loans without details
        /// </summary>
        public async Task<IEnumerable<LoanDto>> GetLoansAsync()
        {
            var query = _context.Loans
                .AsQueryable();

            return await query.Select(loan => MapLoan(loan)).ToListAsync();
        }

        /// <summary>
        /// Gets loans borrowed by a user without details
        /// </summary>
        public async Task<IEnumerable<LoanDto>> GetLoansBorrowedByUserAsync(int userId)
        {
            return await _context.Loans
                .Include(l => l.Request)
                .ThenInclude(r => r.Copy)
                .Where(l => l.Request.BorrowerId == userId)
                .Select(loan => MapLoan(loan))
                .ToListAsync();
        }

        /// <summary>
        /// Gets loans of user's media (where user is the lender) without details
        /// </summary>
        public async Task<IEnumerable<LoanDto>> GetLoansOfUserMediaAsync(int userId)
        {
            return await _context.Loans
                .Include(l => l.Request)
                .ThenInclude(r => r.Copy)
                .Where(l => l.Request.Copy.UserId == userId)
                .Select(loan => MapLoan(loan))
                .ToListAsync();
        }
        /// <summary>
        /// Get specific loan by loadId without details
        /// </summary>
        public async Task<LoanDto?> GetLoanByIdAsync(int loanId)
        {
            var loan = await _context.Loans
                .FirstOrDefaultAsync(x => x.LoanId == loanId);

            return loan == null ? null : MapLoan(loan);
        }
        #endregion
        #region Loans With Details
        /// <summary>
        /// Gets loans borrowed by a user with all related details for display
        /// </summary>
        public async Task<IEnumerable<LoanWithDetailsDto>> GetLoansBorrowedByUserWithDetailsAsync(int userId)
        {
            return await _context.Loans
                .Include(l => l.Request)
                    .ThenInclude(r => r.Borrower)
                .Include(l => l.Request)
                    .ThenInclude(r => r.Copy)
                        .ThenInclude(c => c.User) // Owner
                .Include(l => l.Request)
                    .ThenInclude(r => r.Copy)
                        .ThenInclude(c => c.Media)
                .Where(l => l.Request.BorrowerId == userId)
                .Select(loan => MapLoanWithDetails(loan))
                .ToListAsync();
        }

        /// <summary>
        /// Gets loans of user's media (where user is the lender) with all related details
        /// </summary>
        public async Task<IEnumerable<LoanWithDetailsDto>> GetLoansOfUserMediaWithDetailsAsync(int userId)
        {
            return await _context.Loans
                .Include(l => l.Request)
                    .ThenInclude(r => r.Borrower)
                .Include(l => l.Request)
                    .ThenInclude(r => r.Copy)
                        .ThenInclude(c => c.User) // Owner
                .Include(l => l.Request)
                    .ThenInclude(r => r.Copy)
                        .ThenInclude(c => c.Media)
                .Where(l => l.Request.Copy.UserId == userId)
                .Select(loan => MapLoanWithDetails(loan))
                .ToListAsync();
        }

        /// <summary>
        /// Gets a single loan by ID with all related details
        /// </summary>
        public async Task<LoanWithDetailsDto?> GetLoanByIdWithDetailsAsync(int loanId)
        {
            var loan = await _context.Loans
                .Include(l => l.Request)
                    .ThenInclude(r => r.Borrower)
                .Include(l => l.Request)
                    .ThenInclude(r => r.Copy)
                        .ThenInclude(c => c.User) // Owner
                .Include(l => l.Request)
                    .ThenInclude(r => r.Copy)
                        .ThenInclude(c => c.Media)
                .FirstOrDefaultAsync(l => l.LoanId == loanId);

            return loan == null ? null : MapLoanWithDetails(loan);
        }

        #endregion      
        // public async Task<LoanDto?> MarkReturnedAsync(int requestId, ReturnLoanDto dto)
        // {
        //     var loan = await _context.Loans
        //         .Include(l => l.Request)
        //             .ThenInclude(r => r.Copy)
        //         .FirstOrDefaultAsync(l => l.RequestId == requestId);

        //     if (loan == null) return null;
        //     if (loan.Status != "active") throw new InvalidOperationException("Only active loans can be returned.");

        //     var returnedDate = dto.ReturnedDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        //     loan.ReturnedDate = returnedDate;
        //     loan.Status = "returned";
        //     loan.ReturnNotes = dto.ReturnNotes;
        //     loan.UpdatedAt = DateTime.UtcNow;

        //     // mark copy available
        //     loan.Request.Copy.IsAvailable = true;

        //     await _context.SaveChangesAsync();

        //     return new LoanDto
        //     {
        //         LoanId = loan.LoanId,
        //         RequestId = loan.RequestId,
        //         StartDate = loan.StartDate,
        //         DueDate = loan.DueDate,
        //         ReturnedDate = loan.ReturnedDate,
        //         Status = loan.Status,
        //         ReturnNotes = loan.ReturnNotes,
        //     };
        // }

        #region Mapping Methods
        /// <summary>
        /// Maps a basic Loan entity to LoanDto
        /// </summary>
        private static LoanDto MapLoan(Loan loan)
        {
            return new LoanDto
            {
                LoanId = loan.LoanId,
                RequestId = loan.RequestId,
                StartDate = loan.StartDate,
                DueDate = loan.DueDate,
                ReturnedDate = loan.ReturnedDate,
                Status = loan.Status,
                ReturnNotes = loan.ReturnNotes,
            };
        }
        /// <summary>
        /// Maps a Loan entity with all related data to LoanWithDetailsDto
        /// </summary>
        private static LoanWithDetailsDto MapLoanWithDetails(Loan loan)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var isOverdue = loan.DueDate.HasValue && loan.ReturnedDate == null && today > loan.DueDate.Value;
            var daysOverdue = isOverdue && loan.DueDate.HasValue 
                ? (int?)(today.DayNumber - loan.DueDate.Value.DayNumber)
                : null;

            return new LoanWithDetailsDto
            {
                // Basic loan info
                LoanId = loan.LoanId,
                RequestId = loan.RequestId,
                StartDate = loan.StartDate,
                DueDate = loan.DueDate,
                ReturnedDate = loan.ReturnedDate,
                Status = loan.Status ?? "active",
                ReturnNotes = loan.ReturnNotes,
                
                // Media info
                MediaTitle = loan.Request?.Copy?.Media?.Title ?? "Unknown Title",
                MediaType = loan.Request?.Copy?.Media?.MediaType?.ToString() ?? "Unknown Type",
                MediaCreator = loan.Request?.Copy?.Media?.Creator,
                MediaGenre = loan.Request?.Copy?.Media?.Genre,
                
                // User info
                BorrowerId = loan.Request?.BorrowerId ?? 0,
                BorrowerUsername = loan.Request?.Borrower?.Username ?? "Unknown User",
                OwnerId = loan.Request?.Copy?.UserId ?? 0,
                OwnerUsername = loan.Request?.Copy?.User?.Username ?? "Unknown Owner",
                
                // Copy info
                CopyId = loan.Request?.CopyId ?? 0,
                CopyCondition = loan.Request?.Copy?.Condition,
                CopyNotes = loan.Request?.Copy?.Notes,
                
                // Calculated fields
                DaysOverdue = daysOverdue,
                IsOverdue = isOverdue,
            };
        #endregion
        }
    }
}
