using Core.Models.Orders.Dtos;

namespace PaymentsAPI.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _config;

        private readonly IBasketAPIService _basketAPIService;
        private readonly IProductsAPIService _productsAPIService;
        private readonly IOrdersAPIService _ordersAPIService;

        public PaymentService(IConfiguration config, IBasketAPIService basketAPIService, IProductsAPIService productsAPIService, IOrdersAPIService ordersAPIService)
        {
            _config = config;
            _basketAPIService = basketAPIService;
            _productsAPIService = productsAPIService;
            _ordersAPIService = ordersAPIService;
        }

        public async Task<CustomerBasketDto> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            // Basket Service
            CustomerBasketDto basket = await _basketAPIService.GetBasketAsync(basketId);
            if(basket == null) return null;

            decimal shippingPrice = 0m;

            if(basket.DeliveryMethodId.HasValue)
            {
                // Order Service
                var deliveryMethod = await _ordersAPIService.GetDeliveryMethodAsync(basket.DeliveryMethodId.Value);
                shippingPrice = deliveryMethod.Price;
            }

            foreach(var item in basket.Items)
            {
                // Product Service
                var product = await _productsAPIService.GetProductAsync(item.Id);

                if(item.Price != product.Price)
                {
                    item.Price = product.Price;
                }
            }

            var service = new PaymentIntentService();
            PaymentIntent intent;

            if(string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions()
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
                    Currency = "pln",
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions {
                        Enabled = true,
                    }
                };
                intent = await service.CreateAsync(options);
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            else 
            {
                var options = new PaymentIntentUpdateOptions()
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100
                };
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            // Basket Service
            await _basketAPIService.UpdateBasketAsync(basket);

            return basket;
        }

        public async Task<OrderToReturnDto> UpdateOrderPaymentStatus(string paymentIntentId, OrderStatus newPaymentStatus)
        {
            OrderToReturnDto order = await _ordersAPIService.UpdateOrderPaymentStatusAsync(paymentIntentId, newPaymentStatus);
            return order;
        }
    }
}