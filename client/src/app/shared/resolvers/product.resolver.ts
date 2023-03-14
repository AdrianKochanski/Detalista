import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CryptoService } from 'src/app/crypto/crypto.service';
import { ShopService } from 'src/app/shop/shop.service';
import { IProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<IProduct> {

  constructor(private shopService: ShopService, private cryptoService: CryptoService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct> {
    switch(state.url.includes("crypto")) {
      case true:
        return this.cryptoService.getItem(+route.paramMap.get('id'));
      case false:
        return this.shopService.getProduct(+route.paramMap.get('id'));
    }
  }
}
