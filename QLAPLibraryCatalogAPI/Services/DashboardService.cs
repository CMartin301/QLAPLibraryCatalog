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
#pragma warning disable 1591
        Task<DashboardStatsDto> GetStatsAsync(int userId);
        Task<IEnumerable<ActivityDto>> GetRecentActivityAsync(int userId, int count = 5);
        Task<IEnumerable<UpcomingDueDateDto>> GetUpcomingDueDatesAsync(int userId, int daysAhead = 7);
#pragma warning restore 1591
    }
    /// <summary>
    /// Service/data layer operations on/access to dashboard data
    /// </summary>
    public class DashboardService : IDashboardService
    {
        private readonly LibraryCatalogContext _context;
        /// <summary> Constructor </summary>
        public DashboardService(LibraryCatalogContext context) => _context = context;
/// <summary>
/// Gets overview stats for user dashboard
/// </summary>
/// <param name="userId"></param>
/// <returns></returns>
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
/// <summary>
/// Gets recent activity for user
/// </summary>
/// <param name="userId"></param>
/// <param name="count"></param>
/// <returns></returns>
        public async Task<IEnumerable<ActivityDto>> GetRecentActivityAsync(int userId, int count = 5)
        {
            var recentActivity = await _context.Loans
                .Where(l => l.Request.BorrowerId == userId || l.Request.Copy.UserId == userId)
                .OrderByDescending(l => l.UpdatedAt)
                .Take(count)
                .Select(l => new ActivityDto
                {
                    MediaTitle = l.Request.Copy.Media.Title,
                    ActivityType = l.ReturnedDate != null ? "Returned" : "Borrowed",
                    ActivityDate = l.UpdatedAt ?? l.CreatedAt
                })
                .AsNoTracking()
                .ToListAsync();

            //Get media you added
            recentActivity.AddRange(
                await _context.MediaCopies
                    .Include(m => m.Media)
                    .Where(c => c.UserId == userId)
                    .OrderByDescending(c => c.CreatedAt)
                    .Take(count)
                    .Select(c => new ActivityDto
                    {
                        MediaTitle = c.Media.Title,
                        ActivityType = "Added",
                        ActivityDate = c.CreatedAt
                    })
                    .AsNoTracking()
                    .ToListAsync()
            );
            // recentActivity.AddRange(
            //     await _context.BorrowRequests
            //         .Include(r => r.Borrower)
            //         .Include(r => r.Copy)
            //             .ThenInclude(c => c.Media)
            //         .Include(r => r.Copy.User)
            //         .Where(l => l.BorrowerId == userId || l.Copy.UserId == userId)
            //         .OrderByDescending(c => c.UpdatedAt)
            //         .Take(count)
            //         .Select(c => new ActivityDto
            //         {
            //             MediaTitle = c.Copy.Media.Title,
            //             ActivityType = c.Status ?? "Added",
            //             ActivityDate = c.UpdatedAt
            //         })
            //         .AsNoTracking()
            //         .ToListAsync()

            // );

            //Get just the {count} most recent
            recentActivity = recentActivity
                    .OrderByDescending(c => c.ActivityDate)
                    .Take(count)
                    .ToList();

            return recentActivity;
        }
/// <summary>
/// Gets upcoming due dates for user
/// </summary>
/// <param name="userId"></param>
/// <param name="daysAhead"></param>
/// <returns></returns>
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
