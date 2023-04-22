import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoComponent } from './crypto.component';
import { CryptoRoutingModule } from './crypto-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CryptoComponent
  ],
  imports: [
    CommonModule,
    CryptoRoutingModule,
    SharedModule,
  ]
})
export class CryptoModule { }
