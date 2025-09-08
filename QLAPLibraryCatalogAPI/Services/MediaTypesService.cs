using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary> Interface </summary>
    public interface IMediaTypesService
    {
#pragma warning disable 1591
        Task<IEnumerable<MediaTypeDto>> GetActiveMediaTypesAsync();
        Task<MediaTypeDto?> GetMediaTypeByIdAsync(int mediaTypeId);
        Task<MediaTypeDto> CreateMediaTypeAsync(CreateMediaTypeDto createMediaTypeDto);
        Task<MediaTypeDto?> UpdateMediaTypeAsync(int mediaTypeId, CreateMediaTypeDto updateMediaTypeDto);
        Task<bool> DeactivateMediaTypeAsync(int mediaTypeId);
        Task<bool> ReactivateMediaTypeAsync(int mediaTypeId);
#pragma warning restore 1591
    }
    
    /// <summary>
    /// Service/data layer operations on/access to media types
    /// </summary>
    public class MediaTypesService : IMediaTypesService
    {
        private readonly LibraryCatalogContext _context;
        /// <summary> Constructor </summary>
        public MediaTypesService(LibraryCatalogContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Gets active media types
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<MediaTypeDto>> GetActiveMediaTypesAsync()
        {
            return await _context.MediaTypes
                .Where(m => m.IsActive == true)
                .Select(m => new MediaTypeDto
                {
                    MediaTypeId = m.MediaTypeId,
                    Name = m.Name,
                    DisplayName = m.DisplayName,
                    Description = m.Description
                })
                .ToListAsync();
        }
        /// <summary>
        /// Gets media type by ID
        /// </summary>
        /// <param name="mediaTypeId"></param>
        /// <returns></returns>
        public async Task<MediaTypeDto?> GetMediaTypeByIdAsync(int mediaTypeId)
        {
            return await _context.MediaTypes
                .Where(m => m.MediaTypeId == mediaTypeId)
                .Select(m => new MediaTypeDto
                {
                    MediaTypeId = m.MediaTypeId,
                    Name = m.Name,
                    DisplayName = m.DisplayName,
                    Description = m.Description
                })
                .FirstOrDefaultAsync();
        }
         /// <summary>
         /// Creates new media type
         /// </summary>
         /// <param name="createMediaTypeDto"></param>
         /// <returns></returns>
         /// <exception cref="InvalidOperationException"></exception>
        public async Task<MediaTypeDto> CreateMediaTypeAsync(CreateMediaTypeDto createMediaTypeDto)
        {
            var mediaType = new MediaType
            {
                Name = createMediaTypeDto.Name,
                DisplayName = createMediaTypeDto.DisplayName ?? "",
                Description = createMediaTypeDto.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.MediaTypes.Add(mediaType);
            await _context.SaveChangesAsync();
            
            return await GetMediaTypeByIdAsync(mediaType.MediaTypeId) ?? throw new InvalidOperationException("Failed to retrieve created media type");
        }
        /// <summary>
        /// Updates existing media type
        /// </summary>
        /// <param name="id"></param>
        /// <param name="updateMediaDto"></param>
        /// <returns></returns>
        public async Task<MediaTypeDto?> UpdateMediaTypeAsync(int id, CreateMediaTypeDto updateMediaDto)
        {
            var existing = await _context.MediaTypes.FindAsync(id);
            if (existing == null) return null;

            existing.Name = updateMediaDto.Name;
            existing.DisplayName = updateMediaDto.DisplayName ?? "";
            existing.Description = updateMediaDto.Description;
            existing.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return await GetMediaTypeByIdAsync(id);
        }
        /// <summary>
        /// Deactivates existing media type
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> DeactivateMediaTypeAsync(int id)
        {
            var existing = await _context.MediaTypes.FindAsync(id);
            if (existing == null) return false;

            existing.IsActive = false;

            await _context.SaveChangesAsync();

            return true;
        }    
        /// <summary>
        /// Reactivate existing media type
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> ReactivateMediaTypeAsync(int id)
        {
            var existing = await _context.MediaTypes.FindAsync(id);
            if (existing == null) return false;

            existing.IsActive = true;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}