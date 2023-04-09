import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { CryptoService } from 'src/app/crypto/crypto.service';
import { IBasketItem } from 'src/app/shared/models/basket';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;

  constructor(
    private activateRoute: ActivatedRoute,
    private basketService: BasketService,
    private cryptoService: CryptoService
  ) {
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.activateRoute.data.subscribe((data: {product: IProduct}) => {
      this.product = data.product;
    }, error => {
      console.log(error);
    });
  }

  increment() {
    if(!this.product.isCrypto && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrement() {
    if(this.quantity > 1) {
      this.quantity--;
    }
  }

  addItemToBasket() {
    if(this.product.isCrypto) {
      this.cryptoService.buyItem(this.product).subscribe(response => {
        console.log(response);
      }, e => this.cryptoService.parseMetamaskError(e));
    }
    else {
      this.basketService.addItemToBasket(this.product, this.quantity);
    }
  }
}
