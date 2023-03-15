import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
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
    private bcService: BreadcrumbService,
    private basketService: BasketService
  ) {
      this.bcService.set('@productDetails', ' ');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.activateRoute.data.subscribe((data: {product: IProduct}) => {
      this.product = data.product;
      this.bcService.set('@productDetails', this.product.name);
    }, error => {
      console.log(error);
    });
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    if(this.quantity > 1) {
      this.quantity--;
    }
  }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }
}