import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import configuration from 'src/environments/environment';
import { Order } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) { }

  getOrdersForUser() : Observable<Order[]> {
    return this.http.get<Order[]>(configuration.serviceUrls.apiUrl + "api/orders");
  }

  getOrderDetails(id: number) : Observable<Order> {
    return this.http.get<Order>(configuration.serviceUrls.apiUrl + "api/orders/" + id);
  }
}
