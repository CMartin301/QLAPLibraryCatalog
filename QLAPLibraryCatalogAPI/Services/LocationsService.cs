using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary>
    /// Interface for LoansService
    /// </summary>
    public interface ILocationsService
    {
#pragma warning disable 1591
        Task<IEnumerable<LocationZoneDto>> GetLocationZonesAsync();
#pragma warning restore 1591
    }
    /// <summary>
    /// LoansService - operations on/access to loans
    /// </summary>
    public class LocationsService : ILocationsService
    {
        private readonly LibraryCatalogContext _context;
        /// <summary> Constructor </summary>
        public LocationsService(LibraryCatalogContext context) => _context = context;

        #region Location Zones
        /// <summary>
        /// Gets all location zones
        /// </summary>
        public async Task<IEnumerable<LocationZoneDto>> GetLocationZonesAsync()
        {
            var query = _context.LocationZones
                .AsQueryable();

            return await query.Select(locationZone => MapLocationZone(locationZone)).ToListAsync();
        }

        #endregion
        #region Mapping Methods
        /// <summary>
        /// Maps a basic Loan entity to LoanDto
        /// </summary>
        private static LocationZoneDto MapLocationZone(LocationZone locationZone)
        {
            return new LocationZoneDto
            {
                ZoneId = locationZone.ZoneId,
                ZoneName = locationZone.ZoneName,
                ZoneType = locationZone.ZoneType,
                CenterLat = locationZone.CenterLat,
                CenterLong = locationZone.CenterLong
            };
        }
        #endregion
    }
}
