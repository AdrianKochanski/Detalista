import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { ContactComponent } from './contact/contact.component';
import { DetailsComponent } from './details/details.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    HomeComponent,
    ContactComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatExpansionModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
