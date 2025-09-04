using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    public interface IMediaService
    {
        Task<IEnumerable<MediaDto>> GetAllMediaAsync(bool includeCopies = false);
        Task<MediaDto?> GetMediaByIdAsync(int mediaId, bool includeCopies = false);
        Task<MediaDto> CreateMediaAsync(CreateMediaDto createMediaDto);
        Task<MediaDto?> UpdateMediaAsync(int id, CreateMediaDto updateMediaDto);
        Task<bool> DeleteMediaAsync(int id);

        Task<IEnumerable<MediaDto>> GetUserMediaAsync(int userId, bool includeCopies = false);
        // Task<MediaDto?> GetUserMediaByIdAsync(int mediaId, bool includeCopies = false);

    }

    public class MediaService : IMediaService
    {
        private readonly LibraryCatalogContext _context;

        public MediaService(LibraryCatalogContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<MediaDto>> GetAllMediaAsync(bool includeCopies = false)
        {
            var query = _context.Media
                .Include(m => m.MediaType)
                .AsQueryable();

            if (includeCopies)
            {
                query = query.Include(m => m.MediaCopies);
            }

            return await query.Select(m => new MediaDto
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
                },
                Copies = includeCopies
                        ? m.MediaCopies.Select(c => new MediaCopyDto
                        {
                            CopyId = c.CopyId,
                            UserId = c.UserId,
                            MediaId = c.MediaId,
                            Condition = c.Condition,
                            MaxLoanDays = c.MaxLoanDays,
                            RequiresApproval = c.RequiresApproval,
                            IsAvailable = c.IsAvailable,
                            Notes = c.Notes
                        }).ToList()
                        : new List<MediaCopyDto>()
            })
                .ToListAsync();
        }

        public async Task<MediaDto?> GetMediaByIdAsync(int mediaId, bool includeCopies = false)
        {
            var query = _context.Media
                .Include(m => m.MediaType)
                .AsQueryable();

            if (includeCopies)
                query = query.Include(m => m.MediaCopies);

            return await query
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
                    },
                    Copies = includeCopies
                        ? m.MediaCopies.Select(c => new MediaCopyDto
                        {
                            CopyId = c.CopyId,
                            UserId = c.UserId,
                            MediaId = c.MediaId,
                            Condition = c.Condition,
                            MaxLoanDays = c.MaxLoanDays,
                            RequiresApproval = c.RequiresApproval,
                            IsAvailable = c.IsAvailable,
                            Notes = c.Notes
                        }).ToList()
                        : new List<MediaCopyDto>()
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
        

        public async Task<IEnumerable<MediaDto>> GetUserMediaAsync(int userId, bool includeCopies = false)
        {
            var query = _context.Media
                .Include(m => m.MediaType)
                .AsQueryable();

            if (includeCopies)
                query = query.Include(m => m.MediaCopies);

            return await query
                .Where(m => m.MediaCopies.Any(c => c.UserId == userId)) // ensure relation exists
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
                    },
                    Copies = includeCopies
                        ? m.MediaCopies
                            .Where(c => c.UserId == userId) // only copies belonging to this user
                            .Select(c => new MediaCopyDto
                            {
                                CopyId = c.CopyId,
                                UserId = c.UserId,
                                MediaId = c.MediaId,
                                Condition = c.Condition,
                                MaxLoanDays = c.MaxLoanDays,
                                RequiresApproval = c.RequiresApproval,
                                IsAvailable = c.IsAvailable,
                                Notes = c.Notes
                            }).ToList()
                        : new List<MediaCopyDto>()
                })
                .ToListAsync();
        }

    }
}