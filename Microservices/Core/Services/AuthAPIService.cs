using Core.Models.Identity.Dtos;
using Core.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Core.Services
{
    public class AuthAPIService : BaseAPIService, IAuthAPIService
    {
        public AuthAPIService(IHttpClientFactory httpClientFactory, ILogger<AuthAPIService> logger) : base(httpClientFactory, logger)
        {
        }

        public async Task<UserWithTokenDto> LoginAsync(LoginDto loginDto)
        {
            try
            {
                HttpClient client = CreateClient<AuthAPIService>();
                StringContent content = new StringContent(JsonConvert.SerializeObject(loginDto), System.Text.Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync("/api/account/login", content);
                return await DeserializeResponse<UserWithTokenDto>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Request failed for method: {nameof(LoginAsync)} with parameters: {JsonConvert.SerializeObject(loginDto)}", ex.Message);
                throw;
            }
        }
    }
}