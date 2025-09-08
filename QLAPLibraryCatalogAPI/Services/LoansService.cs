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
        Task<LoanDto?> ExtendLoan(int loanId, DateOnly? newDueDate);
        Task<LoanDto?> ReturnLoan(int loanId, bool isBorrower, string? comments);
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
        #region Loan Actions
        /// <summary>
        /// Extend a loan by changing the due date
        /// </summary>
        /// <param name="loanId"></param>
        /// <param name="newDueDate"></param>
        /// <returns></returns>
        public async Task<LoanDto?> ExtendLoan(int loanId, DateOnly? newDueDate)
        {
            var existingLoan = await _context.Loans.FindAsync(loanId);
            if (existingLoan == null) return null;

            if (existingLoan.ReturnedDate != null)
                throw new InvalidOperationException("Cannot extend a loan that has already been returned.");

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (newDueDate != null && newDueDate <= today)
                throw new InvalidOperationException("New due date must be in the future.");

            if (newDueDate != null && newDueDate <= existingLoan.DueDate)
                throw new InvalidOperationException("New due date must be later than current due date.");
            

            existingLoan.DueDate = newDueDate;
            existingLoan.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetLoanByIdAsync(loanId);
        }
        /// <summary>
        /// Confirm loan return for either borrower or lender
        /// </summary>
        /// <param name="loanId"></param>
        /// <param name="isBorrower"></param>
        /// <param name="comments"></param>
        /// <returns></returns>
        public async Task<LoanDto?> ReturnLoan(int loanId, bool isBorrower, string? comments)
        {
            var existingLoan = await _context.Loans.FindAsync(loanId);
            if (existingLoan == null) return null;

            if(existingLoan.ReturnedDate != null)
                throw new InvalidOperationException("You cannot return a loan that has already been returned.");

            if (isBorrower)
            {
                if(existingLoan.BorrowerReturnedAt != null)
                    throw new InvalidOperationException("You have already returned this loan.");
                existingLoan.BorrowerReturnedAt = DateTime.UtcNow;
                existingLoan.BorrowerReturnNotes = comments;
                existingLoan.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                if(existingLoan.LenderConfirmedReturnAt != null)
                    throw new InvalidOperationException("You have already confirmed the return of this loan.");
                existingLoan.LenderConfirmedReturnAt = DateTime.UtcNow;
                existingLoan.LenderReturnNotes = comments;
                existingLoan.UpdatedAt = DateTime.UtcNow;
            }

            if (existingLoan.LenderConfirmedReturnAt != null && existingLoan.BorrowerReturnedAt != null)
            {
                existingLoan.ReturnedDate = DateOnly.FromDateTime(DateTime.UtcNow);
            }

            await _context.SaveChangesAsync();

            return await GetLoanByIdAsync(loanId);
        }

        #endregion
        #region Mapping Methods
        /// <summary>
        /// Maps a basic Loan entity to LoanDto
        /// </summary>
        private static LoanDto MapLoan(Loan loan)
        {
            string status = "returned";
            if (loan.ReturnedDate == null) status = "active";

            return new LoanDto
            {
                LoanId = loan.LoanId,
                RequestId = loan.RequestId,
                StartDate = loan.StartDate,
                DueDate = loan.DueDate,
                ReturnedDate = loan.ReturnedDate,
                Status = status,
                BorrowerReturnedAt = loan.BorrowerReturnedAt,
                BorrowerReturnNotes = loan.BorrowerReturnNotes,
                LenderConfirmedReturnAt = loan.LenderConfirmedReturnAt,
                LenderReturnNotes = loan.LenderReturnNotes
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

            string status = "returned";
            if (loan.ReturnedDate == null) status = "active";
            
            return new LoanWithDetailsDto
            {
                // Basic loan info
                LoanId = loan.LoanId,
                RequestId = loan.RequestId,
                StartDate = loan.StartDate,
                DueDate = loan.DueDate,
                ReturnedDate = loan.ReturnedDate,
                Status = status,
                BorrowerReturnedAt = loan.BorrowerReturnedAt,
                BorrowerReturnNotes = loan.BorrowerReturnNotes,
                LenderConfirmedReturnAt = loan.LenderConfirmedReturnAt,
                LenderReturnNotes = loan.LenderReturnNotes,

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
        }
        #endregion
    }
}
