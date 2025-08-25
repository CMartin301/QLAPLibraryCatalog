using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Data;
using QLAPLibraryCatalogAPI.Models;

namespace QLAPLibraryCatalogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly LibraryCatalogContext dbContext;
        public MediaController(LibraryCatalogContext _context)
        {
            dbContext = _context;
        }
        [HttpGet]
        public IActionResult GetMedia()
        {
            var media = dbContext.Media.Select(x => new Media
            {
                MediaId = x.MediaId,
                MediaTypeId = x.MediaTypeId,
                Title = x.Title,
                Subtitle = x.Subtitle,
                Creator = x.Creator,
                Publisher = x.Publisher,
                PublicationDate = x.PublicationDate,
                Language = x.Language,
                Genre = x.Genre,
                Description = x.Description,
                CoverImageUrl = x.CoverImageUrl,
                Isbn10 = x.Isbn10,
                Isbn13 = x.Isbn13,
                PageCount = x.PageCount,
                IssueNumber = x.IssueNumber,
                Volume = x.Volume,
                Metadata = x.Metadata,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            }).ToList();

            // return new OkObjectResult("Hello World.");
            return new OkObjectResult(media);
        }

     [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                await dbContext.Database.OpenConnectionAsync();
                var connectionString = dbContext.Database.GetConnectionString();
                
                // Use FromSqlRaw with a simple query
                var result = await dbContext.Database.ExecuteSqlRawAsync("SELECT 1");
                
                await dbContext.Database.CloseConnectionAsync();
                return Ok(new { 
                    message = "Database connection successful",
                    connectionString = connectionString
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("test-tables")]
        public async Task<IActionResult> TestTables()
        {
            try
            {
                var sql = @"
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    ORDER BY table_name";
                    
                var tables = await dbContext.Database
                    .SqlQueryRaw<string>(sql)
                    .ToListAsync();
                    
                return Ok(new { tables });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
    }
}