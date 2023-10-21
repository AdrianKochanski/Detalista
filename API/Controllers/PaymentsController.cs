using System.IO;
using System.Threading.Tasks;
using Core.Errors;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly string _whSecret;
        private readonly IPaymentService _paymentService;
        public readonly ILogger<PaymentsController> _logger;

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger, IConfiguration config)
        {
            _logger = logger;
            _paymentService = paymentService;
            _whSecret = config.GetSection("StripeSettings:WhSecret").Value;
        }

        // Płatność krypto
        // 0. Przy przechodzeniu do sekcji płatności oraz tworzeniu paymentIntent
        //  a. Od tej pory koszyk oprócz kwoty w walucie bazowej, przechowuje również kursy innych walut
        //  b. Wartośc zamówienia w ETH zostaje odświeżona jeżeli na koszyku nie ma jeszcze zapisanego transactionId
        //  c. W przypadku gdy transactionId istnieje ale nie mamy pierwotnej kwoty oznacza to błąd
        // 1. Client ma możliwośc dokonania wyboru płatności krypto
        //  a. Przycisk uaktywnia metamaska i prosi o zezwolenie na połączenie
        //  b. Forma płatności oraz waluta zostają wyświetlone dynamicznie w sekcji summary
        //  c. Wciąż można dokonać płatności tradycyjną formą
        // 2. Tworzymy order na którym zapisujemy dodatkowo informacje o walucie i przeliczonej kwocie transakcji
        // 3. Tworzymy transakcję i zapisujemy transactionId na koszyku
        // 4. Client dokonuje płatnosci na kontrakcie ethereum, na którym zostaje zapisane 
        //  a. OrderId
        //  b. Kwota ETH
        //  c. Kwota $
        //  d. Data płatności
        //  e. TransactionId
        // 5. Payment intent wraz z koszykiem zostaje usunięty [PUNKT TEN MOŻE NIE ZOSTAĆ WYKONANY!]
        //  a. Jeżeli koszyk posiada aktualny transactionId to nie możemy modyfikować koszyka, ani dokonać powtórnej płatności,
        //      wymagana informacja o tym że transakcja jest przetwarzana
        //  b. Client odpytuje o status transakcji jeżeli koszyk posiada transactionId i jeżeli płatność została zakończona, 
        //      payment intent wraz z koszykiem zostaje usunięty
        // 6. Przechodzac do sekcji zamówień w zamówieniu widoczna jest forma płatności, oraz waluta
        //
        // 5. Server włącza joba, który odpytuje cyklicznie kontrakt o statusy płatności
        //  a. Sprawdza czy płatność nie została już potwierdzona jeżeli tak to usuwa ją z kolejki
        //  b. Sprawdza kwotę czy zgadza się z zapisaną w zamówieniu
        //  c. Potwierdza płatność i usuwa ją z kolejki oczekujących w kontrakcie
        //  d. Czyści obecny koszyk, jeżeli posiada on zapisane transactionId

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
            stripeEvent = EventUtility.ConstructEvent(json, signatureHeader, _whSecret);

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