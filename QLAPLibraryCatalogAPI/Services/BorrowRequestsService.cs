using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface IBorrowRequestService
    {
        Task<IEnumerable<BorrowRequestDto>> GetBorrowRequestsAsync();
        Task<IEnumerable<BorrowRequestDto>> GetBorrowRequestsForBorrowerAsync(int borrowerId);
        Task<IEnumerable<BorrowRequestDto>> GetBorrowRequestsForLenderAsync(int lenderId);
        Task<BorrowRequestDto?> GetBorrowRequestByIdAsync(int requestId);
        Task<BorrowRequestDto> CreateBorrowRequestAsync(CreateBorrowRequestDto dto);
        Task<BorrowRequestDto?> ApproveBorrowRequestAsync(int requestId);
        Task<BorrowRequestDto?> DenyBorrowRequestAsync(int requestId, DenyBorrowRequestDto dto);
        Task<bool> CancelBorrowRequestAsync(int requestId, int actorUserId);
    }

    public class BorrowRequestService : IBorrowRequestService
    {
        private readonly LibraryCatalogContext _context;
        public BorrowRequestService(LibraryCatalogContext context) => _context = context;

        public async Task<IEnumerable<BorrowRequestDto>> GetBorrowRequestsAsync()
        {
            var q = _context.BorrowRequests
                .Include(r => r.Borrower)
                .Include(r => r.Copy)
                .ThenInclude(c => c.Media)
                .AsQueryable();

            return await q.Select(r => MapBorrowRequest(r)).ToListAsync();
        }
        public async Task<IEnumerable<BorrowRequestDto>> GetBorrowRequestsForBorrowerAsync(int borrowerId)
        {
            var query = _context.BorrowRequests
                .Include(r => r.Borrower)
                .Include(r => r.Copy)
                .ThenInclude(c => c.Media)
                .AsQueryable();

            return await query
                .Where(r => r.BorrowerId == borrowerId)
                .Select(r => MapBorrowRequest(r)).ToListAsync();
        }
        public async Task<IEnumerable<BorrowRequestDto>> GetBorrowRequestsForLenderAsync(int lenderId)
        {
            var query = _context.BorrowRequests
                .Include(r => r.Borrower)
                .Include(r => r.Copy)
                .ThenInclude(c => c.Media)
                .AsQueryable();

            return await query
                .Where(r => r.Copy.UserId == lenderId)
                .Select(r => MapBorrowRequest(r)).ToListAsync();
        }

        public async Task<BorrowRequestDto?> GetBorrowRequestByIdAsync(int requestId)
        {
            var r = await _context.BorrowRequests
                .Include(r => r.Borrower)
                .Include(x => x.Copy)
                .ThenInclude(c => c.Media)
                .FirstOrDefaultAsync(x => x.RequestId == requestId);

            return r == null ? null : MapBorrowRequest(r);
        }

        public async Task<BorrowRequestDto> CreateBorrowRequestAsync(CreateBorrowRequestDto dto)
        {
            var borrower = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == dto.BorrowerId)
                ?? throw new InvalidOperationException("Borrower not found");

            var copy = await _context.MediaCopies
                // .Include(c => c.Media)
                .Include(c => c.User)
                    // .ThenInclude(u => u.UserPreferences)
                .FirstOrDefaultAsync(c => c.CopyId == dto.CopyId)
                ?? throw new InvalidOperationException("Media copy not found");

            if (copy.UserId == dto.BorrowerId) throw new InvalidOperationException("You cannot request your own copy.");

            // Check for active loans for that copy
            var hasActiveLoan = await _context.Loans
                .Include(l => l.Request)
                .AnyAsync(l => l.Request.CopyId == dto.CopyId && l.ReturnedDate == null);

            if (copy.IsAvailable != true || hasActiveLoan) throw new InvalidOperationException("Copy is currently unavailable.");

            // Validate requested date window
            if (dto.RequestedStartDate.HasValue && dto.RequestedEndDate.HasValue)
            {
                if (dto.RequestedEndDate.Value < dto.RequestedStartDate.Value)
                    throw new InvalidOperationException("requested_end_date cannot be before requested_start_date.");
            }

            var request = new BorrowRequest
            {
                BorrowerId = dto.BorrowerId,
                CopyId = dto.CopyId,
                Status = "pending",
                Message = dto.Message,
                RequestedStartDate = dto.RequestedStartDate,
                RequestedEndDate = dto.RequestedEndDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // var ownerAutoApprove = copy.RequiresApproval == false || (copy.User?.UserPreferences?.AutoApproveRequests ?? false);
            // if (ownerAutoApprove)
            // {
            //     request.Status = "approved";
            //     request.ApprovedAt = DateTime.UtcNow;
            // }

            _context.BorrowRequests.Add(request);
            await _context.SaveChangesAsync();

            // await using var tx = await _context.Database.BeginTransactionAsync();
            // try
            // {
            //     _context.BorrowRequests.Add(request);
            //     await _context.SaveChangesAsync();

            //     // if (request.Status == "approved")
            //     // {
            //     //     await CreateLoanForApprovedRequest_Internal(request,
            //     //         borrowerDefaultDays: borrower.UserPreferences?.DefaultLoanDays,
            //     //         copyMaxDays: copy.MaxLoanDays);

            //     //     copy.IsAvailable = false;
            //     //     await _context.SaveChangesAsync();
            //     // }

            //     await tx.CommitAsync();
            // }
            // catch
            // {
            //     await tx.RollbackAsync();
            //     throw;
            // }

            return await GetBorrowRequestByIdAsync(request.RequestId) ?? throw new InvalidOperationException("Failed to fetch created request");
        }

        public async Task<BorrowRequestDto?> ApproveBorrowRequestAsync(int requestId)
        {
            var request = await _context.BorrowRequests
                .Include(r => r.Copy)
                .Include(r => r.Borrower)
                .FirstOrDefaultAsync(r => r.RequestId == requestId);

            if (request == null) return null;
            if (request.Status != "pending") throw new InvalidOperationException("Only pending requests can be approved.");

            request.Status = "approved";
            request.ApprovedAt = DateTime.UtcNow;
            request.UpdatedAt = DateTime.UtcNow;

            await using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.SaveChangesAsync();

                await CreateLoanForApprovedRequest_Internal(
                    request
                    // borrowerDefaultDays: request.Borrower.UserPreferences?.DefaultLoanDays,
                    // copyMaxDays: request.Copy.MaxLoanDays,
                    // overrideStartDate: dto.StartDate,
                    // overrideDueDate: dto.DueDate
                );

                request.Copy.IsAvailable = false;
                await _context.SaveChangesAsync();

                await tx.CommitAsync();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }

            return await GetBorrowRequestByIdAsync(request.RequestId);
        }

        public async Task<BorrowRequestDto?> DenyBorrowRequestAsync(int requestId, DenyBorrowRequestDto dto)
        {
            var request = await _context.BorrowRequests.FirstOrDefaultAsync(r => r.RequestId == requestId);
            if (request == null) return null;
            if (request.Status != "pending") throw new InvalidOperationException("Only pending requests can be denied.");

            request.Status = "denied";
            request.DeniedAt = DateTime.UtcNow;
            request.DenialReason = string.IsNullOrWhiteSpace(dto.Reason) ? "Denied by owner" : dto.Reason!.Trim();
            request.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GetBorrowRequestByIdAsync(request.RequestId);
        }

        public async Task<bool> CancelBorrowRequestAsync(int requestId, int actorUserId)
        {
            var request = await _context.BorrowRequests.FirstOrDefaultAsync(r => r.RequestId == requestId);
            if (request == null) return false;
            if (request.BorrowerId != actorUserId) throw new InvalidOperationException("Only the borrower can cancel their request.");
            if (request.Status != "pending") throw new InvalidOperationException("Only pending requests can be cancelled.");

            request.Status = "cancelled";
            request.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
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
        //         ReturnNotes = loan.ReturnNotes
        //     };
        // }

        // ---------------- Helper ----------------
        private async Task CreateLoanForApprovedRequest_Internal(
            BorrowRequest request
            // int? borrowerDefaultDays,
            // int? copyMaxDays,
            // DateOnly? overrideStartDate = null,
            // DateOnly? overrideDueDate = null
            )
        {
            // // start date resolution
            // var start = overrideStartDate
            //             ?? request.RequestedStartDate
            //             ?? DateOnly.FromDateTime(DateTime.UtcNow);

            // // duration resolution
            // int? requestedSpan = null;
            // if (request.RequestedStartDate.HasValue && request.RequestedEndDate.HasValue)
            // {
            //     requestedSpan = (request.RequestedEndDate.Value.ToDateTime(TimeOnly.MinValue) - request.RequestedStartDate.Value.ToDateTime(TimeOnly.MinValue)).Days;
            //     if (requestedSpan < 0) requestedSpan = null;
            // }

            // int durationDays;
            // if (overrideDueDate.HasValue)
            //     durationDays = (overrideDueDate.Value.ToDateTime(TimeOnly.MinValue) - start.ToDateTime(TimeOnly.MinValue)).Days;
            // else if (requestedSpan.HasValue)
            //     durationDays = requestedSpan.Value;
            // else if (borrowerDefaultDays.HasValue)
            //     durationDays = borrowerDefaultDays.Value;
            // else if (copyMaxDays.HasValue && copyMaxDays.Value > 0)
            //     durationDays = copyMaxDays.Value;
            // else
            //     durationDays = 14;

            // if (durationDays <= 0) durationDays = 7;

            // var due = start.AddDays(durationDays);

            // already exists check (db unique also enforced)
            var exists = await _context.Loans.AnyAsync(l => l.RequestId == request.RequestId);
            if (exists) return;

            var loan = new Loan
            {
                RequestId = request.RequestId,
                StartDate = request.RequestedStartDate,
                DueDate = request.RequestedEndDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
        }

        private static BorrowRequestDto MapBorrowRequest(BorrowRequest r)
        {
            return new BorrowRequestDto
            {
                RequestId = r.RequestId,
                BorrowerId = r.BorrowerId,
                BorrowerUsername = r.Borrower.Username,
                CopyId = r.CopyId,
                Status = r.Status,
                Message = r.Message,
                RequestedStartDate = r.RequestedStartDate,
                RequestedEndDate = r.RequestedEndDate,
                ApprovedAt = r.ApprovedAt,
                DeniedAt = r.DeniedAt,
                DenialReason = r.DenialReason,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt,
                MediaTitle = r.Copy.Media.Title,
                MediaCreator = r.Copy.Media.Creator
            };
        }
    }
}
