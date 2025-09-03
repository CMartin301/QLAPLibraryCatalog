using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface IUserMediaCopiesService
    {
        Task<IEnumerable<UserMediaCopyDto>> GetAllUserMediaCopiesAsync();
        // Task<MediaDto?> GetMediaByIdAsync(int mediaId);
        // Task<MediaDto> CreateMediaAsync(CreateMediaDto createMediaDto);
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
        
        public async Task<MediaDto?> GetMediaByIdAsync(int mediaId)
        {
            return await _context.Media
                .Include(m => m.MediaType)
                .Where(m => m.MediaId == mediaId)
                .Select(m => new MediaDto
                {
                    MediaId = m.MediaId,
                    MediaTypeId = m.MediaTypeId,
                    Title = m.Title,
                    Subtitle = m.Subtitle,
                    Creator = m.Creator,
                    Publisher = m.Publisher,
                    PublicationDate = m.PublicationDate,
                    Language = m.Language,
                    Genre = m.Genre,
                    Description = m.Description,
                    CoverImageUrl = m.CoverImageUrl,
                    Isbn10 = m.Isbn10,
                    Isbn13 = m.Isbn13,
                    PageCount = m.PageCount,
                    IssueNumber = m.IssueNumber,
                    Volume = m.Volume,
                    MediaType = new MediaTypeDto
                    {
                        MediaTypeId = m.MediaType.MediaTypeId,
                        Name = m.MediaType.Name,
                        DisplayName = m.MediaType.DisplayName,
                        Description = m.MediaType.Description
                    }
                })
                .FirstOrDefaultAsync();
        }
         
        public async Task<MediaDto> CreateMediaAsync(CreateMediaDto createMediaDto)
        {
            var media = new Media
            {
                MediaTypeId = createMediaDto.MediaTypeId,
                Title = createMediaDto.Title,
                Subtitle = createMediaDto.Subtitle,
                Creator = createMediaDto.Creator,
                Publisher = createMediaDto.Publisher,
                PublicationDate = createMediaDto.PublicationDate,
                Language = createMediaDto.Language,
                Genre = createMediaDto.Genre,
                Description = createMediaDto.Description,
                CoverImageUrl = createMediaDto.CoverImageUrl,
                Isbn10 = createMediaDto.Isbn10,
                Isbn13 = createMediaDto.Isbn13,
                PageCount = createMediaDto.PageCount,
                IssueNumber = createMediaDto.IssueNumber,
                Volume = createMediaDto.Volume,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.Media.Add(media);
            await _context.SaveChangesAsync();
            
            return await GetMediaByIdAsync(media.MediaId) ?? throw new InvalidOperationException("Failed to retrieve created media");
        }
        
        public async Task<MediaDto?> UpdateMediaAsync(int id, CreateMediaDto updateMediaDto)
        {
            var existing = await _context.Media.FindAsync(id);
            if (existing == null) return null;
            
            existing.MediaTypeId = updateMediaDto.MediaTypeId;
            existing.Title = updateMediaDto.Title;
            existing.Subtitle = updateMediaDto.Subtitle;
            existing.Creator = updateMediaDto.Creator;
            existing.Publisher = updateMediaDto.Publisher;
            existing.PublicationDate = updateMediaDto.PublicationDate;
            existing.Language = updateMediaDto.Language;
            existing.Genre = updateMediaDto.Genre;
            existing.Description = updateMediaDto.Description;
            existing.CoverImageUrl = updateMediaDto.CoverImageUrl;
            existing.Isbn10 = updateMediaDto.Isbn10;
            existing.Isbn13 = updateMediaDto.Isbn13;
            existing.PageCount = updateMediaDto.PageCount;
            existing.IssueNumber = updateMediaDto.IssueNumber;
            existing.Volume = updateMediaDto.Volume;
            existing.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return await GetMediaByIdAsync(id);
        }
        
        public async Task<bool> DeleteMediaAsync(int id)
        {
            var media = await _context.Media.FindAsync(id);
            if (media == null) return false;
            
            _context.Media.Remove(media);
            await _context.SaveChangesAsync();
            
            return true;
        }
    }
}