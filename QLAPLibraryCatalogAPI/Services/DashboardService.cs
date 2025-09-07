using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary>
    /// Interface for Dashboard data
    /// </summary>
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync(int userId);
        Task<IEnumerable<RecentActivityDto>> GetRecentActivityAsync(int userId, int count = 5);
        Task<IEnumerable<UpcomingDueDateDto>> GetUpcomingDueDatesAsync(int userId, int daysAhead = 7);
    }
    public class DashboardService : IDashboardService
    {
        private readonly LibraryCatalogContext _context;

        public DashboardService(LibraryCatalogContext context) => _context = context;

        public async Task<DashboardStatsDto> GetStatsAsync(int userId)
        {
            var totalBooks = await _context.MediaCopies.CountAsync(c => c.UserId == userId);
            var activeLoans = await _context.Loans
                .CountAsync(l => l.Request.BorrowerId == userId && l.ReturnedDate == null);
            var pendingRequests = await _context.BorrowRequests
                .CountAsync(r => r.BorrowerId == userId && r.Status == "pending");
            var overdueItems = await _context.Loans
                .CountAsync(l => l.Request.BorrowerId == userId 
                                && l.ReturnedDate == null 
                                && l.DueDate < DateOnly.FromDateTime(DateTime.UtcNow));

            return new DashboardStatsDto
            {
                TotalBooks = totalBooks,
                ActiveLoans = activeLoans,
                PendingRequests = pendingRequests,
                OverdueItems = overdueItems
            };
        }

        public async Task<IEnumerable<RecentActivityDto>> GetRecentActivityAsync(int userId, int count = 5)
        {
            return await _context.Loans
                .Where(l => l.Request.BorrowerId == userId || l.Request.Copy.UserId == userId)
                .OrderByDescending(l => l.UpdatedAt)
                .Take(count)
                .Select(l => new RecentActivityDto
                {
                    LoanId = l.LoanId,
                    MediaTitle = l.Request.Copy.Media.Title,
                    ActivityType = l.ReturnedDate != null ? "Returned" : "Borrowed",
                    ActivityDate = l.UpdatedAt ?? l.CreatedAt
                })
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<UpcomingDueDateDto>> GetUpcomingDueDatesAsync(int userId, int daysAhead = 7)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var upcomingLimit = today.AddDays(daysAhead);

            return await _context.Loans
                .Where(l => l.Request.BorrowerId == userId && l.ReturnedDate == null)
                .Where(l => l.DueDate >= today && l.DueDate <= upcomingLimit)
                .Select(l => new UpcomingDueDateDto
                {
                    LoanId = l.LoanId,
                    MediaTitle = l.Request.Copy.Media.Title,
                    DueDate = l.DueDate!.Value,
                    IsOverdue = l.DueDate < today
                })
                .AsNoTracking()
                .ToListAsync();
        }
    }


}
