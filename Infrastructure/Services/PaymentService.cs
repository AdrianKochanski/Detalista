using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Core.Specifications;
using Stripe;
using Product = Core.Entities.Product;
using Core.Entities.Orders;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        //private readonly IBasketRepository _basketRepository;
        //private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public PaymentService(/*IBasketRepository basketRepository, IUnitOfWork unitOfWork, */IConfiguration config)
        {
            _config = config;
            //_basketRepository = basketRepository;
            //_unitOfWork = unitOfWork;
        }

        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            // StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            // CustomerBasket basket = await _basketRepository.GetBasketAsync(basketId);
            // if(basket == null) return null;

            // decimal shippingPrice = 0m;

            // if(basket.DeliveryMethodId.HasValue) 
            // {
            //     var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(basket.DeliveryMethodId.Value);
            //     shippingPrice = deliveryMethod.Price;
            // }

            // foreach(var item in basket.Items)
            // {
            //     var product = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);

            //     if(item.Price != product.Price)
            //     {
            //         item.Price = product.Price;
            //     }
            // }

            // var service = new PaymentIntentService();
            // PaymentIntent intent;

            // if(string.IsNullOrEmpty(basket.PaymentIntentId))
            // {
            //     var options = new PaymentIntentCreateOptions()
            //     {
            //         Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
            //         Currency = "pln",
            //         AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions {
            //             Enabled = true,
            //         }
            //     };
            //     intent = await service.CreateAsync(options);
            //     basket.PaymentIntentId = intent.Id;
            //     basket.ClientSecret = intent.ClientSecret;
            // }
            // else 
            // {
            //     var options = new PaymentIntentUpdateOptions()
            //     {
            //         Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100
            //     };
            //     await service.UpdateAsync(basket.PaymentIntentId, options);
            // }

            // await _basketRepository.UpdateBasketAsync(basket);

            // return basket;
            return await Task.FromResult(new CustomerBasket());
        }

        public async Task<Order> UpdateOrderPaymentStatus(string paymentIntentId, OrderStatus newPaymentStatus)
        {
            // var spec = new OrderByPaymentIntentIdSpecification(paymentIntentId);
            // Order order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            // if(order == null)
            // {
            //     return null;
            // }

            // order.Status = newPaymentStatus;
            // await _unitOfWork.Complete();

            // return order;

            return await Task.FromResult(new Order());
        }
    }
}