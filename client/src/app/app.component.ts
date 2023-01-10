import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'client';
  basketSub: Subscription;

  constructor(private basketService: BasketService){}

  ngOnDestroy(): void {
    this.basketSub.unsubscribe();
  }

  ngOnInit(): void {
    const basketId = localStorage.getItem('basket_id');
    if(basketId) {
      this.basketSub = this.basketService.getBasket(basketId).subscribe();
    }
  }
}
