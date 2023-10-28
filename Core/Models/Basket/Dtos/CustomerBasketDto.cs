using System.ComponentModel.DataAnnotations;

namespace Core.Models.Basket.Dtos
{
    public class CustomerBasketDto
    {
        public Guid Id { get; set; }
        public List<BasketItemDto> Items { get; set; } = new List<BasketItemDto>();
        public int? DeliveryMethodId { get; set; }
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }
        public decimal ShippingPrice { get; set; }
    }
}