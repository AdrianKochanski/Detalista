import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoComponent } from './crypto.component';
import { CryptoRoutingModule } from './crypto-routing.module';



@NgModule({
  declarations: [
    CryptoComponent
  ],
  imports: [
    CommonModule,
    CryptoRoutingModule
  ]
})
export class CryptoModule { }
