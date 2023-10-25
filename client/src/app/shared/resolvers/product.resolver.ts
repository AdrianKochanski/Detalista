import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, map, of, switchMap, take, tap } from 'rxjs';
import { ShopService } from 'src/app/shop/shop.service';
import { Product } from '../models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { CryptoShopService } from 'src/app/crypto/crypto-shop.service';
import { BasketService } from 'src/app/basket/basket.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<{product: Product, quantityInBasket: number}> {

  constructor(
    private shopService: ShopService,
    private bcService: BreadcrumbService,
    private cryptoService: CryptoShopService,
    private basketService: BasketService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{product: Product, quantityInBasket: number}> {
    const id = +route.paramMap.get('id');
    const isCrypto = state.url.includes("crypto");
    this.bcService.set('@productDetails', ' ');

    return this.getProducts(id, isCrypto).pipe(
      tap(p => this.bcService.set('@productDetails', p.name)),
      switchMap(p => this.basketService.basket$.pipe(
        take(1),
        map(basket => {
          if(basket && basket.items) {
            const item = basket.items.find(x => x.id == id);
            console.log(p);

            if(item && !isCrypto) {
              return {
                product: p,
                quantityInBasket: item.quantity
              };
            }
          }

          return {
            product: p,
            quantityInBasket: 0
          };
        })
      ))
    );
  }

  getProducts(id: number, isCrypto: boolean): Observable<Product> {
    switch(isCrypto) {
      case true:
        return this.cryptoService.getProduct(id);
      case false:
        return this.shopService.getProduct(id);
    }
  }
}
