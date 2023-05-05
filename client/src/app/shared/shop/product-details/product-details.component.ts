import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { CryptoShopService } from 'src/app/crypto/crypto-shop.service';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  quantity = 1;
  quantityInBasket = 0;

  constructor(
    private activateRoute: ActivatedRoute,
    private basketService: BasketService,
    private cryptoService: CryptoShopService
  ) {
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.activateRoute.data.subscribe((data: {product: {product: Product, quantityInBasket: number}}) => {
      this.product = data.product.product;
      this.quantity = data.product.quantityInBasket ? data.product.quantityInBasket : 1;
      this.quantityInBasket = data.product.quantityInBasket;
    }, error => {
      console.log(error);
    });
  }

  increment() {
    if(this.product && !this.product.isCrypto && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrement() {
    if(this.quantity > 0) {
      this.quantity--;
    }
  }

  updateBasket() {
    if(this.product) {
      if(this.product.isCrypto) {
        this.cryptoService.buyItem(this.product).subscribe(response => {
          console.log(response);
        }, e => this.cryptoService.parseMetamaskError(e));
      }
      else {
        if(this.quantity > this.quantityInBasket) {
          const addAmount = this.quantity - this.quantityInBasket;
          this.quantityInBasket += addAmount;
          this.basketService.addItemToBasket(this.product, addAmount);
        }
        else {
          const removeAmount = this.quantityInBasket - this.quantity;
          this.quantityInBasket -= removeAmount;
          this.basketService.removeItemFromBasket(this.product.id, removeAmount);
        }
      }
    }
  }
}
