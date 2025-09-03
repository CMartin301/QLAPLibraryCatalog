using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface IMediaCopiesService
    {
        Task<IEnumerable<MediaCopyDto>> GetAllMediaCopiesAsync();
        Task<MediaCopyDto?> GetMediaCopyByIdAsync(int mediaCopyId);
        Task<MediaCopyDto> CreateMediaCopyAsync(CreateMediaCopyDto createMediaCopyDto);
        // Task<MediaDto?> UpdateMediaAsync(int id, CreateMediaDto updateMediaDto);
        // Task<bool> DeleteMediaAsync(int id);
    }
    
    public class MediaCopiesService : IMediaCopiesService
    {
        private readonly LibraryCatalogContext _context;

        public MediaCopiesService(LibraryCatalogContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<MediaCopyDto>> GetAllMediaCopiesAsync()
        {
            return await _context.MediaCopies
                .Include(m => m.Media)
                .Select(m => new MediaCopyDto
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
        
        public async Task<MediaCopyDto?> GetMediaCopyByIdAsync(int mediaCopyId)
        {
            return await _context.MediaCopies
                .Include(m => m.Media)
                .Where(m => m.CopyId == mediaCopyId)
                .Select(m => new MediaCopyDto
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
         
        public async Task<MediaCopyDto> CreateMediaCopyAsync(CreateMediaCopyDto createMediaCopyDto)
        {
            var mediaCopy = new MediaCopy
            {
                UserId = createMediaCopyDto.UserId,
                MediaId = createMediaCopyDto.MediaId,
                Condition = createMediaCopyDto.Condition,
                Notes = createMediaCopyDto.Notes,
                IsAvailable = createMediaCopyDto.IsAvailable,
                MaxLoanDays = createMediaCopyDto.MaxLoanDays,
                RequiresApproval = createMediaCopyDto.RequiresApproval,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.MediaCopies.Add(mediaCopy);
            await _context.SaveChangesAsync();
            
            return await GetMediaCopyByIdAsync(mediaCopy.CopyId) ?? throw new InvalidOperationException("Failed to retrieve created media copy");
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