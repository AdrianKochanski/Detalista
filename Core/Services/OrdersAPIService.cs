using Core.Models;
using Core.Models.Orders;
using Core.Models.Orders.Dtos;
using Core.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Core.Services
{
    public class OrdersAPIService : BaseAPIService, IOrdersAPIService
    {
        public OrdersAPIService(IHttpClientFactory httpClientFactory, ILogger<OrdersAPIService> logger) : base(httpClientFactory, logger)
        {
        }

        public async Task<DeliveryMethod> GetDeliveryMethod(int id)
        {
            try
            {
                HttpClient client = CreateClient(GetType());
                HttpResponseMessage response = await client.GetAsync($"/api/deliveryMethod/{id}");
                return await DeserializeResponse<DeliveryMethod>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Request failed for method: {nameof(GetDeliveryMethod)} with parameters: {id}", ex.Message);
                throw;
            }
        }

        public async Task<OrderToReturnDto> UpdateOrderPaymentStatus(string paymentIntentId, OrderStatus newPaymentStatus)
        {
            try
            {
                HttpClient client = CreateClient(GetType());
                StringContent content = new StringContent(JsonConvert.SerializeObject(newPaymentStatus), System.Text.Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PatchAsync($"/api/updateOrderPaymentStatus/{paymentIntentId}", content);
                return await DeserializeResponse<OrderToReturnDto>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Request failed for method: {nameof(UpdateOrderPaymentStatus)} with parameters: {paymentIntentId}, {newPaymentStatus}", ex.Message);
                throw;
            }
        }
    }
}