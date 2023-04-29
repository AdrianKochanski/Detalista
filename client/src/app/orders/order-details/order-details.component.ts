import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StripeService } from 'src/app/core/services/stripe.service';
import { Basket, BasketTotals } from 'src/app/shared/models/basket';
import { Order, OrderItem } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  private basketHistorySource: BehaviorSubject<Basket> = new BehaviorSubject<Basket>(null);
  public basketHistory$ = this.basketHistorySource.asObservable();
  private basketTotalsHistorySource: BehaviorSubject<BasketTotals> = new BehaviorSubject<BasketTotals>(null);
  public basketTotalsHistory$ = this.basketTotalsHistorySource.asObservable();

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private ordersService: OrdersService,
    private stripeService: StripeService
  ){
    this.breadcrumbService.set('@orderDetails', ' ');
  }

  async ngOnInit(): Promise<void> {
    await this.stripeService.removeBasketWhenPaymentSuccessfull();
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    this.ordersService.getOrderDetails(+this.route.snapshot.paramMap.get("id")).subscribe((order: Order) => {
      this.breadcrumbService.set('@orderDetails', "#" + order.id + " " + order.status + " - " + order.total + "$");

      const basketHistory: Basket = {
        id: "",
        items: [],
        shippingPrice: order.shippingPrice
      };

      order.orderItems.forEach((orderItem: OrderItem) => {
        basketHistory.items.push(
          {
            id: orderItem.productId,
            pictureUrl: orderItem.pictureUrl,
            price: orderItem.price,
            productName: orderItem.productName,
            quantity: orderItem.quantity,
            brand: "",
            type: ""
          }
        );
      });

      const basketTotals: BasketTotals = {
        shipping: order.shippingPrice,
        subtotal: order.subtotal,
        total: order.total
      };

      this.basketHistorySource.next(basketHistory);
      this.basketTotalsHistorySource.next(basketTotals);
    });
  }
}
