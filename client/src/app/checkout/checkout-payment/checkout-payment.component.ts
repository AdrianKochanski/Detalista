import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder, IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';
import { loadStripe, Stripe, StripeElements, StripeElementsOptions, StripeLinkAuthenticationElement, StripePaymentElement } from '@stripe/stripe-js';
import { firstValueFrom, map, Subscription } from 'rxjs';
import { BusyService } from 'src/app/core/services/busy.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  @ViewChild('paymentElement') paymentElement?: ElementRef;
  @ViewChild('linkAuthenticationElement') linkAuthenticationElement?: ElementRef;
  stripe: Stripe | null = null;
  elements: StripeElements;
  payment?: StripePaymentElement;
  linkAuthentication?: StripeLinkAuthenticationElement;
  paymentComplete = false;
  cardPaymentSelected = true;
  currentPaymentMethod = "";
  isLoading: boolean = false;
  basketSub: Subscription;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router,
    private busyService: BusyService)
  {}

  ngOnDestroy(): void {
    if(this.basketSub) {
      this.basketSub.unsubscribe();
    }
  }

  async ngOnInit(): Promise<void> {
     this.basketService.basket$.pipe(
      map(async (basket: IBasket) => {
          if(!this.elements) {
            if(basket === null || basket.clientSecret === null) return;
            this.elements = await this.loadStripeElements(basket.clientSecret);
          }
        }
      )).subscribe();
  }

  async submitOrder() {
    this.isLoading = true;
    const basket = this.basketService.getCurrentBasketValue();
    if(basket == null) throw new Error("Cannot get basket");

    try {
      const createOrder: IOrder = await this.createOrder(basket);
      await this.confirmPaymentWithStripe(this.elements, `https://localhost:4200/orders/${createOrder.id}`);
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
    return (this.paymentComplete && this.checkoutForm?.get('paymentForm')?.valid)
  }

  private async loadStripeElements(clientSecret: string): Promise<StripeElements> {
    this.busyService.busy();
    let elements: StripeElements;

    this.stripe = await loadStripe("pk_test_51MZCj7Lg5EnoM9iaWdWnRlcZzXc0gyuljxLNvyCpsmGXuhSQWhlfUzmzHI6SCvJiZeokvZMvCnSZ1fU2VIyl4uQt00WUlVTi2B");

    if(clientSecret === null) throw new Error("Cannot get client secret");

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

    elements = this.stripe?.elements(options);

    if(elements) {
      this.mountLinkElement(elements);
      this.mountPaymentElement(elements);
    }

    this.busyService.idle();
    return elements;
  }

  private mountLinkElement(elements: StripeElements) {
    if(this.linkAuthentication == null) {
      this.linkAuthentication = elements.create('linkAuthentication');
    }

    this.linkAuthentication.mount(this.linkAuthenticationElement?.nativeElement);
  }

  private mountPaymentElement(elements: StripeElements) {
    this.payment = elements.create('payment',
    {
      layout: {
        type: 'tabs',
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: false
      },
      paymentMethodOrder: ['card', 'p24', 'blik', 'apple_pay', 'google_pay', 'paynow', 'link']
    });

    this.payment.mount(this.paymentElement?.nativeElement);
    this.payment.on("change", event => {
      this.paymentComplete = event.complete;
      this.currentPaymentMethod = event.value.type;

      switch(event.value.type) {
        case "card":
          this.cardPaymentSelected = true;
          this.mountLinkElement(elements);
          break;
        case "link":
          this.cardPaymentSelected = false;
          this.mountLinkElement(elements);
          break;
        default:
          this.cardPaymentSelected = false;
          this.linkAuthentication.unmount();
          break;
      }
    });
  }

  private async confirmPaymentWithStripe(elements: StripeElements, returnUrl: string): Promise<void> {
    const nameOnCard = this.checkoutForm.get("paymentForm").get("nameOnCard").value;

    const result = await this.stripe?.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl ? returnUrl : 'https://localhost:4200/orders',
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
