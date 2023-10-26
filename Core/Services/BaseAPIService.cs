using Core.Models;
using Core.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Core.Services
{
    public class BaseAPIService : IBaseAPIService
    {
        internal readonly IHttpClientFactory _httpClientFactory;
        internal readonly ILogger _logger;
        public BaseAPIService(IHttpClientFactory httpClientFactory, ILogger logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public HttpClient CreateClient<T>(T typeObj) {
            HttpClient client = _httpClientFactory.CreateClient(nameof(typeObj));
            client.Timeout = new TimeSpan(0, 2, 0);
            return client;
        }

        public async Task<T> DeserializeResponse<T>(HttpResponseMessage response) where T: class {
            if(response.IsSuccessStatusCode) {
                string resultContent = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<T>(resultContent);
            }
            else {
                _logger.LogError($"Received status failed for service: {typeof(T)}");
                throw new Exception($"Received status failed for service: {typeof(T)}");
            }
        }
    }
}