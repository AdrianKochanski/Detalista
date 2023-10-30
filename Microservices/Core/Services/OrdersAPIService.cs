using System.Net.Http.Headers;
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

        public async Task<DeliveryMethod> GetDeliveryMethodAsync(int id)
        {
            try
            {
                HttpClient client = CreateClient<OrdersAPIService>();
                HttpResponseMessage response = await client.GetAsync($"/api/orders/deliveryMethod?id={id}");
                return await DeserializeResponse<DeliveryMethod>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Request failed for method: {nameof(GetDeliveryMethodAsync)} with parameters: {id}", ex.Message);
                throw;
            }
        }

        public async Task<OrderToReturnDto> UpdateOrderPaymentStatusAsync(string paymentIntentId, OrderStatus newPaymentStatus, string bearerToken)
        {
            try
            {
                HttpClient client = CreateClient<OrdersAPIService>();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);
                StringContent content = new StringContent(JsonConvert.SerializeObject(1), System.Text.Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PatchAsync($"/api/Orders/updateOrderPaymentStatus/{paymentIntentId}", content);
                return await DeserializeResponse<OrderToReturnDto>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Request failed for method: {nameof(UpdateOrderPaymentStatusAsync)} with parameters: {paymentIntentId}, {newPaymentStatus}", ex.Message);
                throw;
            }
        }
    }
}