import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CryptoComponent } from './crypto.component';
import { ProductDetailsComponent } from '../shared/shop/product-details/product-details.component';
import { ProductResolver } from '../shared/resolvers/product.resolver';

const routes: Routes = [
  {
    path: '',
    component: CryptoComponent
  },
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
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CryptoRoutingModule { }
