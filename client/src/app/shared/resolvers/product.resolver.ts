import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ShopService } from 'src/app/shop/shop.service';
import { IProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<IProduct> {

  constructor(private shopService: ShopService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct> {
    return this.shopService.getProduct(+route.paramMap.get('id'));
  }
}
