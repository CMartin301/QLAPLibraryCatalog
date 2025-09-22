using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;
using QLAPLibraryCatalogAPI.Models.DTOs;

namespace QLAPLibraryCatalogAPI.Services
{
    /// <summary> Interface </summary>
    public interface ITagsService
    {
#pragma warning disable 1591
        Task<IEnumerable<TagDto>> GetTagsAsync();
        Task<TagDto?> GetTagByIDAsync(int tagID);
        Task<TagDto> AddTagAsync(int userID, CreateTagDto tag);
        Task<bool> AddMediaTagAsync(int userID, int mediaID, int tagID);
Task<IEnumerable<TagDto>> GetGenresAsync();
Task<TagDto?> UpdateTagAsync(int tagId, int userId, UpdateTagDto updateTag);
Task<bool> DeleteTagAsync(int tagId);
#pragma warning restore 1591
    }
    /// <summary>
    /// Service/data layer operations on/access to tags
    /// </summary>
    public class TagsService : ITagsService
    {
        private readonly LibraryCatalogContext _context;
        /// <summary> Constructor </summary>
        public TagsService(LibraryCatalogContext context) => _context = context;
        /// <summary>
        /// Gets all tags
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<TagDto>> GetTagsAsync()
        {
            var q = _context.Tags
                .Include(m => m.MediaTags)
                .AsQueryable();

            return await q.Select(r => MapTag(r)).ToListAsync();
        }

        /// <summary>
        /// Gets all tags
        /// </summary>
        /// <returns></returns>
        public async Task<TagDto?> GetTagByIDAsync(int tagID)
        {
            var q = _context.Tags
                .Include(m => m.MediaTags)
                .Where(m => m.TagId == tagID)
                .AsQueryable();

            return await q.Select(r => MapTag(r))
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Adds a tag 
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="tag"></param>
        /// <returns></returns>
        public async Task<TagDto> AddTagAsync(int userID, CreateTagDto tag)
        {
            var createdTag = new Tag
            {
        TagName = tag.TagName,
        IsGenre = tag.IsGenre,          // Add this line
        Description = tag.Description,   // Add this line
        CreatedBy = userID,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow   
            };

            _context.Tags.Add(createdTag);
            await _context.SaveChangesAsync();

            return await GetTagByIDAsync(createdTag.TagId) ?? throw new InvalidOperationException("Failed to retrieve created media");
        }


        /// <summary>
        /// Adds a tag to a piece of media, adds a mediaTag object/association
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="mediaID"></param>
        /// <param name="tagID"></param>
        /// <returns></returns>
        public async Task<bool> AddMediaTagAsync(int userID, int mediaID, int tagID)
        {
            var mediaTag = new MediaTag
            {
                MediaId = mediaID,
                TagId = tagID,
                CreatedBy = userID,
                CreatedAt = DateTime.UtcNow
            };

            _context.MediaTags.Add(mediaTag);
            await _context.SaveChangesAsync();

            return true;
        }
        
        
// Add to TagsService class:
public async Task<IEnumerable<TagDto>> GetGenresAsync()
{
    var q = _context.Tags
        .Include(m => m.MediaTags)
        .Where(t => t.IsGenre == true)
        .AsQueryable();

    return await q.Select(r => MapTag(r)).ToListAsync();
}

public async Task<TagDto?> UpdateTagAsync(int tagId, int userId, UpdateTagDto updateTag)
{
    var existingTag = await _context.Tags.FindAsync(tagId);
    if (existingTag == null) return null;

    existingTag.TagName = updateTag.TagName;
    existingTag.IsGenre = updateTag.IsGenre;
    existingTag.Description = updateTag.Description;
    existingTag.UpdatedBy = userId;
    existingTag.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();
    return await GetTagByIDAsync(tagId);
}

public async Task<bool> DeleteTagAsync(int tagId)
{
    var tag = await _context.Tags.FindAsync(tagId);
    if (tag == null) return false;

    _context.Tags.Remove(tag);
    await _context.SaveChangesAsync();
    return true;
}

        #region Mapping Methods
        private static TagDto MapTag(Tag tag)
        {
            int tagCount = tag.MediaTags.Count();
            return new TagDto
            {
                TagId = tag.TagId,
                TagName = tag.TagName,
                MediaTagCount = tagCount,
                IsGenre = tag.IsGenre,          // Add this line
                Description = tag.Description    // Add this line
            };
        }
        #endregion
    }
}
