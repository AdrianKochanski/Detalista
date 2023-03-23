import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TextInputComponent } from './components/text-input/text-input.component';
import { TextMagnificantDirective } from './directives/text-magnificant.directive';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StepperComponent } from './components/stepper/stepper.component';
import { BasketSummaryComponent } from './components/basket-summary/basket-summary.component';
import { RouterModule } from '@angular/router';
import { StepperControlComponent } from './components/stepper-control/stepper-control.component';
import { ProductItemComponent } from './shop/product-item/product-item.component';
import { ProductFilterComponent } from './shop/product-filter/product-filter.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { ProductPricePipe } from './pipes/product-price.pipe';


@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagerComponent,
    OrderTotalsComponent,
    TextInputComponent,
    TextMagnificantDirective,
    StepperComponent,
    BasketSummaryComponent,
    StepperControlComponent,
    ProductItemComponent,
    ProductFilterComponent,
    ProductDetailsComponent,
    ProductPricePipe
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    CdkStepperModule,
    RouterModule
  ],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    CarouselModule,
    OrderTotalsComponent,
    ReactiveFormsModule,
    BsDropdownModule,
    TextInputComponent,
    TextMagnificantDirective,
    CdkStepperModule,
    StepperComponent,
    BasketSummaryComponent,
    StepperControlComponent,
    ProductItemComponent,
    ProductFilterComponent,
    ProductDetailsComponent,
    ProductPricePipe
  ]
})
export class SharedModule { }
