using Microsoft.AspNetCore.Mvc;

namespace QLAPLibraryCatalogAPI.Controllers
{
    [ApiController]
    public class MediaController : ControllerBase
    {
        public MediaController()
        {
        }

        public IActionResult GetMedia()
        {

            return new OkObjectResult("Hello World.");
        }
    }
}