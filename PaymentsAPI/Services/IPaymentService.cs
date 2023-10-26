namespace PaymentsAPI.Interfaces
{
    public interface IPaymentService
    {
        Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId);

        Task<Order> UpdateOrderPaymentStatus(string paymentIntentId, OrderStatus newPaymentStatus);
    }
}