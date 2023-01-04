import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;

  constructor(private activateRoute: ActivatedRoute, private bcService: BreadcrumbService){
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
}
