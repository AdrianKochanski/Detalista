import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { ShopService } from 'src/app/shop/shop.service';
import { IProduct } from '../models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { CryptoShopService } from 'src/app/crypto/crypto-shop.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<IProduct> {

  constructor(
    private shopService: ShopService,
    private bcService: BreadcrumbService,
    private cryptoService: CryptoShopService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct> {
    this.bcService.set('@productDetails', ' ');
    return this.getProducts(route, state).pipe(
      tap(p => this.bcService.set('@productDetails', p.name))
    );
  }

  getProducts(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct> {
    switch(state.url.includes("crypto")) {
      case true:
        return this.cryptoService.getProduct(+route.paramMap.get('id'));
      case false:
        return this.shopService.getProduct(+route.paramMap.get('id'));
    }
  }
}
