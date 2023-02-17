using System.IO;
using System.Threading.Tasks;
using API.Errors;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private const string WhSecret = "whsec_eb8a6c818c12772b2c88de8f5225f531de68619b12a31281ba3b3b9dd223e51d";
        private readonly IPaymentService _paymentService;
        public readonly ILogger<PaymentsController> _logger;

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            _logger = logger;
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            CustomerBasket basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

            if(basket == null) 
            {
                return BadRequest(new ApiResponse(400, "Problem with your basket"));
            }

            return basket;
        }   

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ParseEvent(json);
            var signatureHeader = Request.Headers["Stripe-Signature"];
            stripeEvent = EventUtility.ConstructEvent(json, signatureHeader, WhSecret);

            PaymentIntent intent;
            Order order;

            switch(stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment succeeded: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentStatus(intent.Id, OrderStatus.PaymentReceived);
                    _logger.LogInformation("Order updatet to payment reveiced: ", order.Id);
                break;
                case "payment_intent.payment_failed":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment failed: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentStatus(intent.Id, OrderStatus.PaymentFailed);
                    _logger.LogInformation("Order updatet to payment failed: ", order.Id);
                break;
            }

            return new EmptyResult();
        }
    }
}