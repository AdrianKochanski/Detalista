import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder, IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';
import { loadStripe, Stripe, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement, PaymentIntentResult } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;
  cardErrors: any;
  isLoading: boolean = false;


  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router,
    private cd: ChangeDetectorRef)
  {}

  ngOnInit(): void {
    loadStripe("pk_test_51MZCj7Lg5EnoM9iaWdWnRlcZzXc0gyuljxLNvyCpsmGXuhSQWhlfUzmzHI6SCvJiZeokvZMvCnSZ1fU2VIyl4uQt00WUlVTi2B")
    .then(stripe => {
      this.stripe = stripe;
      const elements = stripe?.elements();

      if(elements) {
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);
        this.cardNumber.on("change", event => {
          this.cardNumberComplete = event.complete;
          if(event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        });

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
        this.cardExpiry.on("change", event => {
          this.cardExpiryComplete = event.complete;
          if(event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        });

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);
        this.cardCvc.on("change", event => {
          this.cardCvcComplete = event.complete;
          if(event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        });
      }
    });
  }

  async submitOrder() {
    this.isLoading = true;
    const basket = this.basketService.getCurrentBasketValue();
    if(basket == null) throw new Error("Cannot get basket");

    try {
      const createOrder: IOrder = await this.createOrder(basket);
      const paymentResult: PaymentIntentResult = await this.confirmPaymentWithStripe(basket);

      if(paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = {state: createOrder};
        this.router.navigate(['checkout/success'], navigationExtras);
      }
      else {
        this.toastr.error(paymentResult.error.message);
      }
    }
    catch(error: any) {
      console.log(error);
      this.toastr.error(error.message);
    }
    finally {
      this.isLoading = false;
    }
  }

  get paymentFormComplete()
  {
    return this.checkoutForm?.get('paymentForm')?.valid
    && this.cardNumberComplete
    && this.cardExpiryComplete
    && this.cardCvcComplete
  }

  private async confirmPaymentWithStripe(basket: IBasket | null) {
    if (!basket) throw new Error("Basket is null");
    const result = await this.stripe?.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    });

    if(!result) throw new Error("Problem attempting payment with stripe");
    return result;
  }

  private async createOrder(basket: IBasket | null): Promise<IOrder> {
    if (!basket) throw new Error("Basket is null");
    const orderToCreate = this.getOrderToCreate(basket);
    return firstValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  private getOrderToCreate(basket: IBasket): IOrderToCreate {
    const deliveryMethodId = this.checkoutForm.get("deliveryForm").get("deliveryMethod").value;
    const shipToAddress = this.checkoutForm.get("addressForm").value;

    if(!deliveryMethodId || !shipToAddress) throw new Error("Problem with basket");

    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }
}
