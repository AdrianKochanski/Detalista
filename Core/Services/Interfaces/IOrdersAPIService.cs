using Core.Models;
using Core.Models.Orders;
using Core.Models.Orders.Dtos;

namespace Core.Services.Interfaces
{
    public interface IOrdersAPIService
    {
        public Task<DeliveryMethod> GetDeliveryMethod(int id);
        public Task<OrderToReturnDto> UpdateOrderPaymentStatus(string paymentIntentId, OrderStatus newPaymentStatus);
    }
}