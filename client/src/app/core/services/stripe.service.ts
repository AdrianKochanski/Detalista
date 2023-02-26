import { Injectable } from '@angular/core';
import { StripeElements, loadStripe, StripeElementsOptions, Stripe, PaymentIntent } from '@stripe/stripe-js';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  stripe: Stripe | null = null;
  stripeElements: StripeElements | null = null;

  constructor(private busyService: BusyService, private basketService: BasketService) { }

  public async removeBasketWhenPaymentSuccessfull() {
    const basket: IBasket = this.basketService.getCurrentBasketValue();
    const payment: PaymentIntent = await this.retrievePaymentIntent(basket);

    if (payment && payment.status === 'succeeded') {
      this.basketService.deleteBasket(basket);
    }
  }

  public async retrievePaymentIntent(basket: IBasket): Promise<PaymentIntent | null> {
    await this.loadStripe();

    if(!this.stripe || !basket || !basket.clientSecret) return null;

    const {paymentIntent} = await this.stripe.retrievePaymentIntent(basket.clientSecret);
    return paymentIntent;
  }

  public async loadStripeElements(clientSecret: string): Promise<StripeElements> {
    this.busyService.busy();
    this.loadStripe();
    if(clientSecret === null) throw new Error("Cannot get client secret");

    if(!this.stripeElements) {
      await this.removeBasketWhenPaymentSuccessfull();

      const options: StripeElementsOptions = {
        clientSecret: clientSecret,
        appearance: {
          labels: 'floating',
          variables: {
            colorPrimary: '#333',
            colorDanger: '#dc3545',
            colorBackground: '#ffffff',
            colorText: '#212529',
            fontFamily: 'Neucha, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSizeBase: '1rem',
            spacingUnit: '2px',
            fontLineHeight: '1.25',
            fontWeightNormal: '700'
          },
          rules: {
            '.Input': {
              border: "2px solid #333"
            }
          }
        }
      };

      this.stripeElements = this.stripe?.elements(options);
    }

    this.busyService.idle();
    return this.stripeElements;
  }

  public async loadStripe(): Promise<Stripe> {
    if(!this.stripe) {
      this.busyService.busy();
      this.stripe = await loadStripe("pk_test_51MZCj7Lg5EnoM9iaWdWnRlcZzXc0gyuljxLNvyCpsmGXuhSQWhlfUzmzHI6SCvJiZeokvZMvCnSZ1fU2VIyl4uQt00WUlVTi2B");
      this.busyService.idle();
    }

    return this.stripe;
  }
}
