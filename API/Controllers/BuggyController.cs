using Core.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        public BuggyController()
        {
        }

        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest(bool getError)
        {
            if (getError) return NotFound(new ApiResponse(404));
            return Ok();
        }

        [HttpGet("servererror")]
        public ActionResult GetServerError(bool getError)
        {
            if (getError) throw new Exception("Server Error");
            return Ok();
        }

        [HttpGet("badrequest")]
        public ActionResult GetBadRequest(bool getError)
        {
            if (getError) return BadRequest(new ApiResponse(400));
            return Ok();
        }
    }
}