using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface ILoansService
    {
        Task<IEnumerable<LoanDto>> GetLoansAsync();
        // Task<IEnumerable<LoanDto>> GetUserLoansAsync(int userId);
        Task<IEnumerable<LoanDto>> GetLoansBorrowedByUserAsync(int userId);
        Task<IEnumerable<LoanDto>> GetLoansOfUserMediaAsync(int userId);
        Task<LoanDto?> GetLoanByIdAsync(int loanId);
        // Task<LoanDto?> ApproveBorrowRequestAsync(int requestId);
        // Task<LoanDto?> DenyBorrowRequestAsync(int requestId, DenyBorrowRequestDto dto);
        // Task<bool> CancelBorrowRequestAsync(int requestId, int actorUserId);
    }

    public class LoansService : ILoansService
    {
        private readonly LibraryCatalogContext _context;
        public LoansService(LibraryCatalogContext context) => _context = context;

        public async Task<IEnumerable<LoanDto>> GetLoansAsync()
        {
            var query = _context.Loans
                .AsQueryable();

            return await query.Select(loan => MapLoan(loan)).ToListAsync();
        }

        // Loans where the user is the borrower
        public async Task<IEnumerable<LoanDto>> GetLoansBorrowedByUserAsync(int userId)
        {
            return await _context.Loans
                .Include(l => l.Request)
                .ThenInclude(r => r.Copy)
                .Where(l => l.Request.BorrowerId == userId)
                .Select(loan => MapLoan(loan))
                .ToListAsync();
        }

        // Loans where the user is the lender (owns the copy)
        public async Task<IEnumerable<LoanDto>> GetLoansOfUserMediaAsync(int userId)
        {
            return await _context.Loans
                .Include(l => l.Request)
                .ThenInclude(r => r.Copy)
                .Where(l => l.Request.Copy.UserId == userId)
                .Select(loan => MapLoan(loan))
                .ToListAsync();
        }

        // public async Task<IEnumerable<LoanDto>> GetUserLoansAsync(int userId)
        // {
        //     var query = _context.Loans
        //         .Include(l => l.Request)
        //         .ThenInclude(r => r.Copy)
        //         .Where(l => l.Request.Copy.UserId == userId)
        //         .AsQueryable();


        //     return await query.Select(loan => MapLoan(loan)).ToListAsync();
        // }

        public async Task<LoanDto?> GetLoanByIdAsync(int loanId)
        {
            var loan = await _context.Loans
                .FirstOrDefaultAsync(x => x.LoanId == loanId);

            return loan == null ? null : MapLoan(loan);
        }

        

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
        //         LateFeeAmount = loan.LateFeeAmount,
        //         LateFeePaid = loan.LateFeePaid
        //     };
        // }

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
                LateFeeAmount = loan.LateFeeAmount,
                LateFeePaid = loan.LateFeePaid,
            };
        }
    }
}
