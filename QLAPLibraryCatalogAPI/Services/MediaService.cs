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
        Task<IEnumerable<MediaDto>> GetAllMediaAsync(bool includeCopies = false, string? search = null, int? userLocationZoneId = null, decimal? maxDistanceMiles = null );
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
        public async Task<IEnumerable<MediaDto>> GetAllMediaAsync(
            bool includeCopies = false,
            string? search = null,
            int? userLocationZoneId = null,
            decimal? maxDistanceMiles = null)
        {
            var query = _context.Media
                .Include(m => m.MediaType)
                .Include(m => m.MediaCopies)
                    .ThenInclude(mc => mc.HomeLocationZone)
                .Include(m => m.MediaTags)
                    .ThenInclude(m => m.Tag)
                .AsQueryable();

            // Apply search filter
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


            // Get the data from database first
            var mediaList = await query.ToListAsync();

            // Apply location filtering if specified
            if (userLocationZoneId.HasValue && maxDistanceMiles.HasValue)
            {
                var userLocation = await _context.LocationZones
                    .FirstOrDefaultAsync(lz => lz.ZoneId == userLocationZoneId.Value);

                if (userLocation != null)
                {
                    mediaList = FilterByLocationAndAddDistances(mediaList, userLocation, maxDistanceMiles.Value);
                }
            }

            // Convert to DTOs using the existing static method
            var result = mediaList.Select(MapMedia).ToList();

            // Add location information as a separate step
            if (userLocationZoneId.HasValue)
            {
                AddLocationInfo(result, userLocationZoneId.Value);
            }

            return result;
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
                .Include(m => m.MediaCopies)
                    .ThenInclude(mc => mc.HomeLocationZone) 
                .Include(m => m.MediaTags)
                    .ThenInclude(m => m.Tag)
                .AsQueryable();

            return await query
                .Where(m => m.MediaId == mediaId)
                .Select(media => MapMedia(media))
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
                .Include(m => m.MediaCopies)
                .Include(m => m.MediaTags)
                    .ThenInclude(m => m.Tag)
                .AsQueryable();

            return await query
                .Where(m => m.MediaCopies.Any(c => c.UserId == userId))
                .Select(user => MapMedia(user))
                .ToListAsync();
        }

        #region Mapping Methods
        /// <summary>
        /// Maps a media into a media DTO
        /// </summary>
       private static MediaDto MapMedia(Media m)
{
    int? totalCopiesCount = m.MediaCopies.Count();
    int? availableCopiesCount = m.MediaCopies.Where(c => c.IsAvailable == true).Count();
    return new MediaDto
    {
        MediaId = m.MediaId,
        MediaTypeId = m.MediaTypeId,
        MediaTypeName = m.MediaType.DisplayName,
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
        TotalCopiesCount = totalCopiesCount,
        AvailableCopiesCount = availableCopiesCount,
        Tags = m.MediaTags.Select(mediaTag => new TagDto
        {
            TagId = mediaTag.TagId,
            TagName = mediaTag.Tag.TagName,
            IsGenre = mediaTag.Tag.IsGenre,        // Add this line
            Description = mediaTag.Tag.Description  // Add this line
        }).ToList()
        // Remove the entire Genres property mapping
    };
}
        
        private MediaDto MapMediaWithLocation(Media m, int? userLocationZoneId = null, decimal? maxDistanceMiles = null)
        {
            int? totalCopiesCount = m.MediaCopies.Count();
            int? availableCopiesCount = m.MediaCopies.Where(c => c.IsAvailable == true).Count();
            
            // Calculate nearest copy distance if user location provided
            decimal? nearestDistance = null;
            string? nearestLocationName = null;
            
            if (userLocationZoneId.HasValue)
            {
                var userLocation = _context.LocationZones.FirstOrDefault(lz => lz.ZoneId == userLocationZoneId.Value);
                if (userLocation != null)
                {
                    var availableCopies = m.MediaCopies.Where(mc => mc.IsAvailable == true && mc.HomeLocationZone != null);
                    
                    var nearestCopy = availableCopies
                        .Select(mc => new {
                            Copy = mc,
                            Distance = CalculateDistance(
                                userLocation.CenterLat.Value, userLocation.CenterLong.Value,
                                mc.HomeLocationZone.CenterLat.Value, mc.HomeLocationZone.CenterLong.Value
                            )
                        })
                        .OrderBy(x => x.Distance)
                        .FirstOrDefault();
                        
                    if (nearestCopy != null)
                    {
                        nearestDistance = nearestCopy.Distance;
                        nearestLocationName = nearestCopy.Copy.HomeLocationZone.ZoneName;
                    }
                }
            }

            return new MediaDto
            {
                MediaId = m.MediaId,
                MediaTypeId = m.MediaTypeId,
                MediaTypeName = m.MediaType.DisplayName,
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
                TotalCopiesCount = totalCopiesCount,
                AvailableCopiesCount = availableCopiesCount,
                Tags = m.MediaTags.Select(mediaTag => new TagDto
{
    TagId = mediaTag.TagId,
    TagName = mediaTag.Tag.TagName,
    IsGenre = mediaTag.Tag.IsGenre,        // Add this line
    Description = mediaTag.Tag.Description  // Add this line
}).ToList(),
                NearestCopyDistance = nearestDistance,
                NearestCopyLocationName = nearestLocationName
            };
        }
        #endregion
        #region Helper Functions

        private List<Media> FilterByLocationAndAddDistances(
            List<Media> mediaList, 
            LocationZone userLocation, 
            decimal maxDistanceMiles)
        {
            var filteredMedia = new List<Media>();
            
            foreach (var media in mediaList)
            {
                var availableCopies = media.MediaCopies
                    .Where(mc => mc.IsAvailable == true && mc.HomeLocationZone != null)
                    .ToList();
                    
                if (!availableCopies.Any()) continue;
                
                // Calculate distances to all available copies
                var copyDistances = availableCopies
                    .Select(mc => new {
                        Copy = mc,
                        Distance = CalculateDistance(
                            userLocation.CenterLat.Value, userLocation.CenterLong.Value,
                            mc.HomeLocationZone.CenterLat.Value, mc.HomeLocationZone.CenterLong.Value
                        )
                    })
                    .Where(cd => cd.Distance <= maxDistanceMiles)
                    .ToList();
                    
                if (copyDistances.Any())
                {
                    filteredMedia.Add(media);
                }
            }
            
            return filteredMedia;
        }

        private static decimal CalculateDistance(decimal lat1, decimal lon1, decimal lat2, decimal lon2)
        {
            // Haversine formula for calculating distance in miles
            var dLat = ToRadians((double)(lat2 - lat1));
            var dLon = ToRadians((double)(lon2 - lon1));

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians((double)lat1)) * Math.Cos(ToRadians((double)lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var distance = 3959 * c; // Earth's radius in miles

            return (decimal)distance;
        }
private void AddLocationInfo(List<MediaDto> mediaDtos, int userLocationZoneId)
{
    var userLocation = _context.LocationZones.FirstOrDefault(lz => lz.ZoneId == userLocationZoneId);
    if (userLocation == null) return;

    foreach (var dto in mediaDtos)
    {
        var media = _context.Media
            .Include(m => m.MediaCopies)
                .ThenInclude(mc => mc.HomeLocationZone)
            .FirstOrDefault(m => m.MediaId == dto.MediaId);
            
        if (media == null) continue;

        var availableCopies = media.MediaCopies
            .Where(mc => mc.IsAvailable == true && mc.HomeLocationZone != null);
        
        var nearestCopy = availableCopies
            .Select(mc => new {
                Copy = mc,
                Distance = CalculateDistance(
                    userLocation.CenterLat.Value, userLocation.CenterLong.Value,
                    mc.HomeLocationZone.CenterLat.Value, mc.HomeLocationZone.CenterLong.Value
                )
            })
            .OrderBy(x => x.Distance)
            .FirstOrDefault();
            
        if (nearestCopy != null)
        {
            dto.NearestCopyDistance = nearestCopy.Distance;
            dto.NearestCopyLocationName = nearestCopy.Copy.HomeLocationZone.ZoneName;
        }
    }
}

private static double ToRadians(double degrees) => degrees * (Math.PI / 180);
        #endregion
    }
}