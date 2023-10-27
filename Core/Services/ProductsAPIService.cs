using Core.Models.Dtos;
using Core.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace Core.Services
{
    public class ProductsAPIService : BaseAPIService, IProductsAPIService
    {
        public ProductsAPIService(IHttpClientFactory httpClientFactory, ILogger<ProductsAPIService> logger) : base(httpClientFactory, logger)
        {
        }

        public async Task<ProductToReturnDto> GetProductAsync(int id)
        {
            try
            {
                HttpClient client = CreateClient(GetType());
                HttpResponseMessage response = await client.GetAsync($"/api/products/{id}");
                return await DeserializeResponse<ProductToReturnDto>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Request failed for method: {nameof(GetProductAsync)} with parameters: {id}", ex.Message);
                throw;
            }
        }
    }
}