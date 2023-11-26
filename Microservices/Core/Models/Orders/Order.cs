using System.ComponentModel.DataAnnotations;

namespace Core.Models.Orders
{
    public class Order : BaseEntity
    {
        public Order()
        {
        }

        public Order(string buyerEmail, Address shipToAddress, DeliveryMethod deliveryMethod, 
            IReadOnlyList<OrderItem> orderItems, decimal subtotal, string paymentIntentId)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
            PaymentIntentId = paymentIntentId;
        }

        public string BuyerEmail {get; set;}
        public DateTime OrderDate {get; set;} = DateTime.UtcNow;
        
        [Required]
        public Address ShipToAddress {get; set;}
        public DeliveryMethod DeliveryMethod {get; set;}
        public IReadOnlyList<OrderItem> OrderItems {get; set;}
        public decimal Subtotal {get; set;}
        public OrderStatus Status {get; set;} = OrderStatus.Pending;
        public string PaymentIntentId {get; set;}

        public decimal GetTotal() {
            return Subtotal + DeliveryMethod.Price;
        }
    }
}