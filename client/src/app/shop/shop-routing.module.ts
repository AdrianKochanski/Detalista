import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductResolver } from '../shared/resolvers/product.resolver';
import { ProductDetailsComponent } from '../shared/shop/product-details/product-details.component';
import { ShopComponent } from './shop.component';

const routes: Routes = [
  {path: '', component: ShopComponent},
  {
    path: ':id',
    component: ProductDetailsComponent,
    data: {
      breadcrumb: {
        alias: 'productDetails'
      }
    },
    resolve: {
      product: ProductResolver
    }
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ShopRoutingModule { }
