import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { Basket } from 'src/app/shared/models/basket';
import { Order, OrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';
import { Stripe, StripeElements, StripeLinkAuthenticationElement, StripePaymentElement } from '@stripe/stripe-js';
import { firstValueFrom, map, Subscription } from 'rxjs';
import { StripeService } from 'src/app/core/services/stripe.service';
import configuration from 'src/environments/environment';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  @ViewChild('paymentElement') paymentElement?: ElementRef;
  @ViewChild('linkAuthenticationElement') linkAuthenticationElement?: ElementRef;
  payment?: StripePaymentElement;
  linkAuthentication?: StripeLinkAuthenticationElement;
  stripe: Stripe;
  elementsLoaded: boolean = false;
  paymentComplete = false;
  cardOrLinkPaymentSelected = true;
  currentNameOnCard = "";
  isLoading: boolean = false;
  basketSub: Subscription;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router,
    private stripeService: StripeService)
  {}

  ngOnDestroy(): void {
    if(this.basketSub) {
      this.basketSub.unsubscribe();
    }
  }

  async ngOnInit(): Promise<void> {
    this.stripe = await this.stripeService.loadStripe();

    this.basketService.basket$.pipe(
    map(async (basket: Basket) => {
        await this.loadStripeElements(basket);
      }
    )).subscribe();
  }

  async submitOrder() {
    this.isLoading = true;
    const basket = this.basketService.getCurrentBasketValue();
    if(!basket || !basket.clientSecret) throw new Error("Cannot get basket");

    try {
      const createOrder: Order = await this.createOrder(basket);
      await this.confirmPaymentWithStripe(basket.clientSecret, `${configuration.serviceUrls.apiUrl}orders/${createOrder.id}`);
      this.basketService.deleteBasket(basket);
      const navigationExtras: NavigationExtras = {state: createOrder};
      this.router.navigate(['checkout/success'], navigationExtras);
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
    const formValid: boolean = this.checkoutForm?.get('paymentForm')?.valid;
    return (
      this.paymentComplete && (formValid || !this.cardOrLinkPaymentSelected)
    )
  }

  private async loadStripeElements(basket: Basket): Promise<void> {
    if(basket === null || basket.clientSecret === null) return;
    const elements: StripeElements = await this.stripeService.loadStripeElements(basket.clientSecret);

    if(elements && !this.elementsLoaded) {
      this.elementsLoaded = true;
      this.mountLinkElement(elements);
      this.mountPaymentElement(elements);
    }
  }

  private mountLinkElement(elements: StripeElements) {
    if(!this.linkAuthentication) {
      this.linkAuthentication = elements.create('linkAuthentication');

      this.linkAuthentication.on("change", event => {
        this.currentNameOnCard = event.value.email;
      });
    }

    this.linkAuthentication.mount(this.linkAuthenticationElement?.nativeElement);
  }

  private mountPaymentElement(elements: StripeElements) {
    if(!this.payment) {
      this.payment = elements.create('payment',
      {
        layout: {
          type: 'tabs',
          defaultCollapsed: false,
          radios: true,
          spacedAccordionItems: false
        },
        paymentMethodOrder: ['card', 'p24', 'blik', 'google_pay', 'apple_pay', 'paynow', 'link']
      });

      this.payment.on("change", event => {
        this.paymentComplete = event.complete;

        switch(event.value.type) {
          case "card":
            this.cardOrLinkPaymentSelected = true;
            this.mountLinkElement(elements);
            break;
          case "link":
            this.cardOrLinkPaymentSelected = true;
            this.mountLinkElement(elements);
            this.setNameOnCard();
            break;
          default:
            this.cardOrLinkPaymentSelected = false;
            this.linkAuthentication.unmount();
            break;
        }
      });
    }

    this.payment.mount(this.paymentElement?.nativeElement);
  }

  private setNameOnCard() {
    const paymentForm = this.checkoutForm.get("paymentForm");
    if(!paymentForm.value.nameOnCard) {
      paymentForm.patchValue({nameOnCard: this.currentNameOnCard});
    }
  }

  private async confirmPaymentWithStripe(clientSecret: string, returnUrl: string): Promise<void> {
    const nameOnCard = this.checkoutForm.get("paymentForm").get("nameOnCard").value;
    const elements = await this.stripeService.loadStripeElements(clientSecret)

    const result = await this.stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl ? returnUrl : `${configuration.serviceUrls.apiUrl}orders`,
        payment_method_data: {
          billing_details: {
            name: nameOnCard
          }
        }
      },
      redirect: "if_required",
    });

    if(!result) throw new Error("Problem attempting payment with stripe");
    if(result.error) throw new Error(result.error.message);
  }

  private async createOrder(basket: Basket | null): Promise<Order> {
    if (!basket) throw new Error("Basket is null");
    const orderToCreate = this.getOrderToCreate(basket);
    return firstValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  private getOrderToCreate(basket: Basket): OrderToCreate {
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
