using Microsoft.AspNetCore.Mvc;

namespace QLAPLibraryCatalogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        public MediaController()
        {
        }
        [HttpGet]
        public IActionResult GetMedia()
        {

            return new OkObjectResult("Hello World.");
        }
    }
}