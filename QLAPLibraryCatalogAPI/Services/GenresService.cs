using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary>
    /// Interface for Genre service operations
    /// </summary>
    public interface IGenresService
    {
#pragma warning disable 1591
        Task<IEnumerable<GenreDto>> GetActiveGenresAsync();
        Task<IEnumerable<GenreDto>> GetAllGenresAsync();
        Task<GenreDto?> GetGenreByIdAsync(int genreId);
        Task<GenreDto> CreateGenreAsync(int userId, CreateGenreDto createGenreDto);
        Task<GenreDto?> UpdateGenreAsync(int genreId, int userId, UpdateGenreDto updateGenreDto);
        Task<bool> DeactivateGenreAsync(int genreId);
        Task<bool> ReactivateGenreAsync(int genreId);
        Task<bool> AddMediaGenreAsync(int userId, int mediaId, int genreId);
        Task<bool> RemoveMediaGenreAsync(int mediaId, int genreId);
#pragma warning restore 1591
    }

    /// <summary>
    /// Service for genre-related operations
    /// </summary>
    public class GenresService : IGenresService
    {
        private readonly LibraryCatalogContext _context;

        /// <summary>Constructor</summary>
        public GenresService(LibraryCatalogContext context) => _context = context;

        /// <summary>
        /// Gets all active genres
        /// </summary>
        public async Task<IEnumerable<GenreDto>> GetActiveGenresAsync()
        {
            return await _context.Genres
                .Include(g => g.MediaGenres)
                .Where(g => g.IsActive)
                .OrderBy(g => g.GenreName)
                .Select(genre => MapGenre(genre))
                .ToListAsync();
        }

        /// <summary>
        /// Gets all genres (active and inactive)
        /// </summary>
        public async Task<IEnumerable<GenreDto>> GetAllGenresAsync()
        {
            return await _context.Genres
                .Include(g => g.MediaGenres)
                .OrderBy(g => g.GenreName)
                .Select(genre => MapGenre(genre))
                .ToListAsync();
        }

        /// <summary>
        /// Gets genre by ID
        /// </summary>
        public async Task<GenreDto?> GetGenreByIdAsync(int genreId)
        {
            return await _context.Genres
                .Include(g => g.MediaGenres)
                .Where(g => g.GenreId == genreId)
                .Select(genre => MapGenre(genre))
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Creates a new genre
        /// </summary>
        public async Task<GenreDto> CreateGenreAsync(int userId, CreateGenreDto createGenreDto)
        {
            var genre = new Genre
            {
                GenreName = createGenreDto.GenreName,
                Description = createGenreDto.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = userId
            };

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            return await GetGenreByIdAsync(genre.GenreId) 
                ?? throw new InvalidOperationException("Failed to retrieve created genre");
        }

        /// <summary>
        /// Updates an existing genre
        /// </summary>
        public async Task<GenreDto?> UpdateGenreAsync(int genreId, int userId, UpdateGenreDto updateGenreDto)
        {
            var existing = await _context.Genres.FindAsync(genreId);
            if (existing == null) return null;

            existing.GenreName = updateGenreDto.GenreName;
            existing.Description = updateGenreDto.Description;
            existing.IsActive = updateGenreDto.IsActive;
            existing.UpdatedAt = DateTime.UtcNow;
            existing.UpdatedBy = userId;

            await _context.SaveChangesAsync();
            return await GetGenreByIdAsync(genreId);
        }

        /// <summary>
        /// Deactivates a genre
        /// </summary>
        public async Task<bool> DeactivateGenreAsync(int genreId)
        {
            var existing = await _context.Genres.FindAsync(genreId);
            if (existing == null) return false;

            existing.IsActive = false;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Reactivates a genre
        /// </summary>
        public async Task<bool> ReactivateGenreAsync(int genreId)
        {
            var existing = await _context.Genres.FindAsync(genreId);
            if (existing == null) return false;

            existing.IsActive = true;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Adds a genre to a media item
        /// </summary>
        public async Task<bool> AddMediaGenreAsync(int userId, int mediaId, int genreId)
        {
            // Check if the relationship already exists
            var exists = await _context.MediaGenres
                .AnyAsync(mg => mg.MediaId == mediaId && mg.GenreId == genreId);

            if (exists) return false; // Already exists

            var mediaGenre = new MediaGenre
            {
                MediaId = mediaId,
                GenreId = genreId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId
            };

            _context.MediaGenres.Add(mediaGenre);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Removes a genre from a media item
        /// </summary>
        public async Task<bool> RemoveMediaGenreAsync(int mediaId, int genreId)
        {
            var mediaGenre = await _context.MediaGenres
                .FirstOrDefaultAsync(mg => mg.MediaId == mediaId && mg.GenreId == genreId);

            if (mediaGenre == null) return false;

            _context.MediaGenres.Remove(mediaGenre);
            await _context.SaveChangesAsync();
            return true;
        }

        #region Mapping Methods
        private static GenreDto MapGenre(Genre genre)
        {
            return new GenreDto
            {
                GenreId = genre.GenreId,
                GenreName = genre.GenreName,
                Description = genre.Description,
                IsActive = genre.IsActive,
                MediaGenreCount = genre.MediaGenres.Count
            };
        }
        #endregion
    }
}