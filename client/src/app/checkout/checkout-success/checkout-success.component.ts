import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent {
  order: Order;

  constructor(private router: Router){
    const navigation = this.router.getCurrentNavigation();
    const state = navigation && navigation.extras && navigation.extras.state;

    if(state) {
      this.order = state as Order;
    }
  }

  goToOrders() {
    if(this.order) {
      this.router.navigate(["orders", this.order.id]);
    }
    else {
      this.router.navigate(["orders"]);
    }
  }
}
