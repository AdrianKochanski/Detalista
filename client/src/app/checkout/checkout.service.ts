import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import configuration from 'src/environments/environment';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { Order, OrderToCreate } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) { }

  createOrder(order: OrderToCreate) : Observable<Order>{
    return this.http.post<Order>(configuration.serviceUrls.apiUrl + 'api/orders', order);
  }

  getDeliveryMethods() {
    return this.http.get(configuration.serviceUrls.apiUrl + 'api/orders/deliveryMethods').pipe(
      map((dm: DeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }
}
