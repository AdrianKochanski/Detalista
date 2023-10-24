using Core.Entities;
using Core.Entities.Orders;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
        Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId);

        Task<Order> UpdateOrderPaymentStatus(string paymentIntentId, OrderStatus newPaymentStatus);
    }
}