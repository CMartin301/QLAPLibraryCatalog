using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary> Interface </summary>
    public interface IMediaService
    {
#pragma warning disable 1591
        Task<IEnumerable<MediaDto>> GetAllMediaAsync(bool includeCopies = false, string? search = null);
        Task<MediaDto?> GetMediaByIdAsync(int mediaId, bool includeCopies = false);
        Task<MediaDto> CreateMediaAsync(CreateMediaDto createMediaDto);
        Task<MediaDto?> UpdateMediaAsync(int id, CreateMediaDto updateMediaDto);
        Task<bool> DeleteMediaAsync(int id);

        Task<IEnumerable<MediaDto>> GetUserMediaAsync(int userId, bool includeCopies = false);
        // Task<MediaDto?> GetUserMediaByIdAsync(int mediaId, bool includeCopies = false);
#pragma warning restore 1591

    }

    /// <summary>
    /// Service/data layer operations on/access to media
    /// </summary>
    public class MediaService : IMediaService
    {
        private readonly LibraryCatalogContext _context;
        /// <summary> Constructor </summary>
        public MediaService(LibraryCatalogContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Gets all media
        /// </summary>
        /// <param name="includeCopies"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public async Task<IEnumerable<MediaDto>> GetAllMediaAsync(bool includeCopies = false, string? search = null)
        {
            var query = _context.Media
                .Include(m => m.MediaType)
                .AsQueryable();


            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchTerm = search.ToLower();
                query = query.Where(m =>
                    m.Title.ToLower().Contains(searchTerm) ||
                    (m.Subtitle != null && m.Subtitle.ToLower().Contains(searchTerm)) ||
                    m.Creator.ToLower().Contains(searchTerm) ||
                    (m.Publisher != null && m.Publisher.ToLower().Contains(searchTerm)) ||
                    (m.Language != null && m.Language.ToLower().Contains(searchTerm)) ||
                    (m.Genre != null && m.Genre.ToLower().Contains(searchTerm)) ||
                    (m.Description != null && m.Description.ToLower().Contains(searchTerm)) ||
                    (m.Isbn10 != null && m.Isbn10.Contains(searchTerm)) ||
                    (m.Isbn13 != null && m.Isbn13.Contains(searchTerm)) ||
                    m.MediaType.DisplayName.ToLower().Contains(searchTerm)
                );
            }

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
/// <summary>
/// Gets media by ID
/// </summary>
/// <param name="mediaId"></param>
/// <param name="includeCopies"></param>
/// <returns></returns>
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
/// <summary>
/// Creates new media object
/// </summary>
/// <param name="createMediaDto"></param>
/// <returns></returns>
/// <exception cref="InvalidOperationException"></exception>
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
/// <summary>
/// Updates existing media object
/// </summary>
/// <param name="mediaId"></param>
/// <param name="updateMediaDto"></param>
/// <returns></returns>
        public async Task<MediaDto?> UpdateMediaAsync(int mediaId, CreateMediaDto updateMediaDto)
        {
            var existingMedia = await _context.Media.FindAsync(mediaId);
            if (existingMedia == null) return null;

            existingMedia.MediaTypeId = updateMediaDto.MediaTypeId;
            existingMedia.Title = updateMediaDto.Title;
            existingMedia.Subtitle = updateMediaDto.Subtitle;
            existingMedia.Creator = updateMediaDto.Creator;
            existingMedia.Publisher = updateMediaDto.Publisher;
            existingMedia.PublicationDate = updateMediaDto.PublicationDate;
            existingMedia.Language = updateMediaDto.Language;
            existingMedia.Genre = updateMediaDto.Genre;
            existingMedia.Description = updateMediaDto.Description;
            existingMedia.CoverImageUrl = updateMediaDto.CoverImageUrl;
            existingMedia.Isbn10 = updateMediaDto.Isbn10;
            existingMedia.Isbn13 = updateMediaDto.Isbn13;
            existingMedia.PageCount = updateMediaDto.PageCount;
            existingMedia.IssueNumber = updateMediaDto.IssueNumber;
            existingMedia.Volume = updateMediaDto.Volume;
            existingMedia.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetMediaByIdAsync(mediaId);
        }
/// <summary>
/// Deletes existing media object
/// </summary>
/// <param name="id"></param>
/// <returns></returns>
        public async Task<bool> DeleteMediaAsync(int id)
        {
            var media = await _context.Media.FindAsync(id);
            if (media == null) return false;

            _context.Media.Remove(media);
            await _context.SaveChangesAsync();

            return true;
        }
        
/// <summary>
/// Gets all media a user owns a copy of
/// </summary>
/// <param name="userId"></param>
/// <param name="includeCopies"></param>
/// <returns></returns>
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