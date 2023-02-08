import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: IOrder[];

  constructor(private ordersService: OrdersService){}

  ngOnInit(): void {
    this.ordersService.getOrdersForUser().subscribe((data: IOrder[]) => {
      this.orders = data;
    }, error => {
      console.log(error);
    });
  }

}
