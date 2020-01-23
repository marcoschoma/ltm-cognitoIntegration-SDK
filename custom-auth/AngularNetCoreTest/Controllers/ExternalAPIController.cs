using System.Threading.Tasks;
using AngularNetCoreTest.Clients;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace AngularNetCoreTest.Controllers
{
    [Authorize]
    [ApiController]
    [Route("external-api")]
    public class ExternalAPIController : Controller
    {
        IExternalAPIClient _client;

        public ExternalAPIController(IExternalAPIClient client)
        {
            _client = client;
        }

        [HttpGet]
		public async Task<string> GetDataFromExternalServer()
		{
            return await _client.Get();
		}
	}
}
