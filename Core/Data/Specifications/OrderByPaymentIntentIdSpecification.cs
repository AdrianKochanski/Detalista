using Core.Models.Orders;

namespace Core.Data.Specifications
{
    public class OrderByPaymentIntentIdSpecification : BaseSpecifcation<Order>
    {
        public OrderByPaymentIntentIdSpecification(string paymentIntentId) 
            : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }
    }
}