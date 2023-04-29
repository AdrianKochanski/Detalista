import { Component, OnInit } from '@angular/core';
import { StripeService } from '../core/services/stripe.service';
import { Order } from '../shared/models/order';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[];

  constructor(private ordersService: OrdersService, private stripeService: StripeService){}

  async ngOnInit(): Promise<void> {
    await this.stripeService.removeBasketWhenPaymentSuccessfull();

    this.ordersService.getOrdersForUser().subscribe((data: Order[]) => {
      this.orders = data;
    }, error => {
      console.log(error);
    });
  }

}
