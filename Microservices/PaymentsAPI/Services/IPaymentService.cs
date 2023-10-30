namespace PaymentsAPI.Interfaces
{
    public interface IPaymentService
    {
        Task<CustomerBasketDto> CreateOrUpdatePaymentIntent(string basketId);

        Task<OrderToReturnDto> UpdateOrderPaymentStatus(string paymentIntentId, OrderStatus newPaymentStatus);
    }
}