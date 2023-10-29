using Core.Models.Basket.Dtos;
using Core.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Core.Services
{
    public class BasketAPIService : BaseAPIService, IBasketAPIService
    {
        public BasketAPIService(IHttpClientFactory httpClientFactory, ILogger<BasketAPIService> logger) : base(httpClientFactory, logger)
        {
        }

        public async Task<CustomerBasketDto> GetBasketAsync(string basketId)
        {
            try
            {
                HttpClient client = CreateClient<BasketAPIService>();
                HttpResponseMessage response = await client.GetAsync($"/api/basket?id={basketId}");
                return await DeserializeResponse<CustomerBasketDto>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Request failed for method: {nameof(GetBasketAsync)} with parameters: {basketId}", ex.Message);
                throw;
            }
        }

        public async Task<CustomerBasketDto> UpdateBasketAsync(CustomerBasketDto basket)
        {
            try
            {
                HttpClient client = CreateClient<BasketAPIService>();
                StringContent content = new StringContent(JsonConvert.SerializeObject(basket), System.Text.Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync("/api/basket", content);
                return await DeserializeResponse<CustomerBasketDto>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Request failed for method: {nameof(UpdateBasketAsync)} with parameters: {JsonConvert.SerializeObject(basket)}", ex.Message);
                throw;
            }
        }
    }
}