using Core.Models;
using Core.Models.Orders;
using Core.Models.Orders.Dtos;

namespace Core.Services.Interfaces
{
    public interface IOrdersAPIService
    {
        public Task<DeliveryMethod> GetDeliveryMethodAsync(int id);
        public Task<OrderToReturnDto> UpdateOrderPaymentStatusAsync(string paymentIntentId, OrderStatus newPaymentStatus);
    }
}