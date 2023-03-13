import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import configuration from 'src/environments/environment';
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) { }

  getOrdersForUser() : Observable<IOrder[]> {
    return this.http.get<IOrder[]>(configuration.baseUrl + "orders");
  }

  getOrderDetails(id: number) : Observable<IOrder> {
    return this.http.get<IOrder>(configuration.baseUrl + "orders/" + id);
  }
}
