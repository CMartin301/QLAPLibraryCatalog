using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary> Interface </summary>
    public interface IMediaCopiesService
    {
#pragma warning disable 1591
        Task<IEnumerable<MediaCopyDto>> GetAllMediaCopiesAsync();
        Task<IEnumerable<MediaCopyDto>> GetMediaCopiesByMediaIDAsync(int mediaId);
        Task<MediaCopyDto?> GetMediaCopyByIdAsync(int mediaCopyId);
        Task<MediaCopyDto> CreateMediaCopyAsync(CreateMediaCopyDto createMediaCopyDto);
        // Task<MediaDto?> UpdateMediaAsync(int id, CreateMediaDto updateMediaDto);
        // Task<bool> DeleteMediaAsync(int id);
#pragma warning restore 1591
    }

    /// <summary>
    /// Service/data layer operations on/access to media copies
    /// </summary>
    public class MediaCopiesService : IMediaCopiesService
    {
        private readonly LibraryCatalogContext _context;
        /// <summary> Constructor </summary>
        public MediaCopiesService(LibraryCatalogContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Gets all media copies
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<MediaCopyDto>> GetAllMediaCopiesAsync()
        {
            var query = _context.MediaCopies
                .Include(m => m.Media)
                .Include(m => m.CurrentLocationZone)
                .Include(m => m.HomeLocationZone)
                .Include(m => m.User)
                .AsQueryable();

            return await query.Select(mediaCopy => MapMediaCopy(mediaCopy)).ToListAsync();
        }
        /// <summary>
        /// Gets copies of some media 
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<MediaCopyDto>> GetMediaCopiesByMediaIDAsync(int mediaId)
        {
            var query = _context.MediaCopies
                .Include(m => m.Media)
                .Include(m => m.CurrentLocationZone)
                .Include(m => m.HomeLocationZone)
                .Include(m => m.User)
                .Where(m => m.MediaId == mediaId)
                .AsQueryable();

            return await query.Select(mediaCopy => MapMediaCopy(mediaCopy)).ToListAsync();
        }
        /// <summary>
        /// Gets media copy by ID
        /// </summary>
        /// <param name="mediaCopyId"></param>
        /// <returns></returns>
        public async Task<MediaCopyDto?> GetMediaCopyByIdAsync(int mediaCopyId)
        {
            var mediaCopy = await _context.MediaCopies
                .Include(m => m.Media)
                .Include(m => m.CurrentLocationZone)
                .Include(m => m.HomeLocationZone)
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.CopyId == mediaCopyId);

            return mediaCopy == null ? null : MapMediaCopy(mediaCopy);
        }
        /// <summary>
        /// Creates new media copy
        /// </summary>
        /// <param name="createMediaCopyDto"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task<MediaCopyDto> CreateMediaCopyAsync(CreateMediaCopyDto createMediaCopyDto)
        {
            var mediaCopy = new MediaCopy
            {
                UserId = createMediaCopyDto.UserId,
                MediaId = createMediaCopyDto.MediaId,
                Condition = createMediaCopyDto.Condition,
                Notes = createMediaCopyDto.Notes,
                IsAvailable = createMediaCopyDto.IsAvailable,
                CurrentLocationZoneId = createMediaCopyDto.HomeLocationZoneId,
                HomeLocationZoneId = createMediaCopyDto.HomeLocationZoneId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.MediaCopies.Add(mediaCopy);
            await _context.SaveChangesAsync();

            return await GetMediaCopyByIdAsync(mediaCopy.CopyId) ?? throw new InvalidOperationException("Failed to retrieve created media copy");
        }

        #region Mapping Methods
        /// <summary>
        /// Maps a media copy to a media copy DTO
        /// </summary>
        private static MediaCopyDto MapMediaCopy(MediaCopy mediaCopy)
        {
            string? currentLocationZoneName = mediaCopy.CurrentLocationZone != null ? mediaCopy.CurrentLocationZone.ZoneName : null;
            string? homeLocationZoneName = mediaCopy.HomeLocationZone != null ? mediaCopy.HomeLocationZone.ZoneName : null;
            
            return new MediaCopyDto
            {
                CopyId = mediaCopy.CopyId,
                UserId = mediaCopy.UserId,
                MediaId = mediaCopy.MediaId,
                Condition = mediaCopy.Condition,
                Notes = mediaCopy.Notes,
                IsAvailable = mediaCopy.IsAvailable,
                MediaTitle = mediaCopy.Media.Title,
                MediaCreator = mediaCopy.Media.Creator,
                OwnerUsername = mediaCopy.User.Username,
                OwnerUserId = mediaCopy.User.UserId,
                CurrentLocationZoneName = currentLocationZoneName,
                HomeLocationZoneName = homeLocationZoneName,
            };
        }
        #endregion
        
    }
}