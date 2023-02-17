import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IBasket, IBasketTotals } from 'src/app/shared/models/basket';
import { IOrder, IOrderItem } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  private basketHistorySource: BehaviorSubject<IBasket> = new BehaviorSubject<IBasket>(null);
  public basketHistory$ = this.basketHistorySource.asObservable();
  private basketTotalsHistorySource: BehaviorSubject<IBasketTotals> = new BehaviorSubject<IBasketTotals>(null);
  public basketTotalsHistory$ = this.basketTotalsHistorySource.asObservable();

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private ordersService: OrdersService
  ){
    this.breadcrumbService.set('@orderDetails', ' ');
  }

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    this.ordersService.getOrderDetails(+this.route.snapshot.paramMap.get("id")).subscribe((order: IOrder) => {
      this.breadcrumbService.set('@orderDetails', "#" + order.id + " " + order.status + " - " + order.total + "$");
      console.log(order);
      const basketHistory: IBasket = {
        id: "",
        items: [],
        shippingPrice: order.shippingPrice
      };

      order.orderItems.forEach((orderItem: IOrderItem) => {
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

      const basketTotals: IBasketTotals = {
        shipping: order.shippingPrice,
        subtotal: order.subtotal,
        total: order.total
      };

      this.basketHistorySource.next(basketHistory);
      this.basketTotalsHistorySource.next(basketTotals);
    });
  }
}
