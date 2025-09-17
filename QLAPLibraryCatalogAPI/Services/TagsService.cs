using Microsoft.EntityFrameworkCore;
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
                .AsQueryable();

            return await q.Select(r => MapTag(r)).ToListAsync();
        }

        #region Mapping Methods
        private static TagDto MapTag(Tag tag)
        {
            return new TagDto
            {
                TagId = tag.TagId,
                TagName = tag.TagName
            };
        }
        #endregion
    }
}
