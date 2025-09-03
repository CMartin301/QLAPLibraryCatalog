using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface IUserMediaCopiesService
    {
        Task<IEnumerable<UserMediaCopyDto>> GetAllUserMediaCopiesAsync();
        Task<UserMediaCopyDto?> GetMediaCopyByIdAsync(int mediaCopyId);
        Task<UserMediaCopyDto> CreateMediaCopyAsync(CreateUserMediaCopyDto createUserMediaCopyDto);
        // Task<MediaDto?> UpdateMediaAsync(int id, CreateMediaDto updateMediaDto);
        // Task<bool> DeleteMediaAsync(int id);
    }
    
    public class UserMediaCopiesService : IUserMediaCopiesService
    {
        private readonly LibraryCatalogContext _context;

        public UserMediaCopiesService(LibraryCatalogContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<UserMediaCopyDto>> GetAllUserMediaCopiesAsync()
        {
            return await _context.UserMediaCopies
                .Include(m => m.Media)
                .Select(m => new UserMediaCopyDto
                {
                    CopyId = m.CopyId,
                    UserId = m.UserId,
                    MediaId = m.MediaId,
                    Condition = m.Condition,
                    Notes = m.Notes,
                    IsAvailable = m.IsAvailable,
                    MaxLoanDays = m.MaxLoanDays,
                    RequiresApproval = m.RequiresApproval,
                    Media = new MediaDto
                    {
                        MediaId = m.MediaId,
                        MediaTypeId = m.Media.MediaTypeId,
                        Title = m.Media.Title,
                        Subtitle = m.Media.Subtitle,
                        Creator = m.Media.Creator,
                        Publisher = m.Media.Publisher,
                        PublicationDate = m.Media.PublicationDate,
                        Language = m.Media.Language,
                        Genre = m.Media.Genre,
                        Description = m.Media.Description,
                        CoverImageUrl = m.Media.CoverImageUrl,
                        Isbn10 = m.Media.Isbn10,
                        Isbn13 = m.Media.Isbn13,
                        PageCount = m.Media.PageCount,
                        IssueNumber = m.Media.IssueNumber,
                        Volume = m.Media.Volume,
                    }
                })
                .ToListAsync();
        }
        
        public async Task<UserMediaCopyDto?> GetMediaCopyByIdAsync(int mediaCopyId)
        {
            return await _context.UserMediaCopies
                .Include(m => m.Media)
                .Where(m => m.CopyId == mediaCopyId)
                .Select(m => new UserMediaCopyDto
                {
                    CopyId = m.CopyId,
                    UserId = m.UserId,
                    MediaId = m.MediaId,
                    Condition = m.Condition,
                    Notes = m.Notes,
                    IsAvailable = m.IsAvailable,
                    MaxLoanDays = m.MaxLoanDays,
                    RequiresApproval = m.RequiresApproval,
                    Media = new MediaDto
                    {
                        MediaId = m.MediaId,
                        MediaTypeId = m.Media.MediaTypeId,
                        Title = m.Media.Title,
                        Subtitle = m.Media.Subtitle,
                        Creator = m.Media.Creator,
                        Publisher = m.Media.Publisher,
                        PublicationDate = m.Media.PublicationDate,
                        Language = m.Media.Language,
                        Genre = m.Media.Genre,
                        Description = m.Media.Description,
                        CoverImageUrl = m.Media.CoverImageUrl,
                        Isbn10 = m.Media.Isbn10,
                        Isbn13 = m.Media.Isbn13,
                        PageCount = m.Media.PageCount,
                        IssueNumber = m.Media.IssueNumber,
                        Volume = m.Media.Volume,
                    }
                })
                .FirstOrDefaultAsync();
        }
         
        public async Task<UserMediaCopyDto> CreateMediaCopyAsync(CreateUserMediaCopyDto createUserMediaCopyDto)
        {
            var userMediaCopy = new UserMediaCopy
            {
                UserId = createUserMediaCopyDto.UserId,
                MediaId = createUserMediaCopyDto.MediaId,
                Condition = createUserMediaCopyDto.Condition,
                Notes = createUserMediaCopyDto.Notes,
                IsAvailable = createUserMediaCopyDto.IsAvailable,
                MaxLoanDays = createUserMediaCopyDto.MaxLoanDays,
                RequiresApproval = createUserMediaCopyDto.RequiresApproval,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.UserMediaCopies.Add(userMediaCopy);
            await _context.SaveChangesAsync();
            
            return await GetMediaCopyByIdAsync(userMediaCopy.CopyId) ?? throw new InvalidOperationException("Failed to retrieve created media copy");
        }
        
        // public async Task<MediaDto?> UpdateMediaAsync(int id, CreateMediaDto updateMediaDto)
        // {
        //     var existing = await _context.Media.FindAsync(id);
        //     if (existing == null) return null;
            
        //     existing.MediaTypeId = updateMediaDto.MediaTypeId;
        //     existing.Title = updateMediaDto.Title;
        //     existing.Subtitle = updateMediaDto.Subtitle;
        //     existing.Creator = updateMediaDto.Creator;
        //     existing.Publisher = updateMediaDto.Publisher;
        //     existing.PublicationDate = updateMediaDto.PublicationDate;
        //     existing.Language = updateMediaDto.Language;
        //     existing.Genre = updateMediaDto.Genre;
        //     existing.Description = updateMediaDto.Description;
        //     existing.CoverImageUrl = updateMediaDto.CoverImageUrl;
        //     existing.Isbn10 = updateMediaDto.Isbn10;
        //     existing.Isbn13 = updateMediaDto.Isbn13;
        //     existing.PageCount = updateMediaDto.PageCount;
        //     existing.IssueNumber = updateMediaDto.IssueNumber;
        //     existing.Volume = updateMediaDto.Volume;
        //     existing.UpdatedAt = DateTime.UtcNow;
            
        //     await _context.SaveChangesAsync();
            
        //     return await GetUserMediaCopyByIdAsync(mediaCopyId);
        // }
        
        // public async Task<bool> DeleteMediaAsync(int id)
        // {
        //     var media = await _context.Media.FindAsync(id);
        //     if (media == null) return false;
            
        //     _context.Media.Remove(media);
        //     await _context.SaveChangesAsync();
            
        //     return true;
        // }
    }
}