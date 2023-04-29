import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';
import { Basket } from './shared/models/basket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'client';
  basketSub: Subscription;
  userSub: Subscription;

  constructor(private basketService: BasketService, private accountSerice: AccountService){}

  ngOnDestroy(): void {
    this.basketSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadBasket();
    this.loadUser();
  }

  loadBasket(): void {
    const basketId = localStorage.getItem('basket_id');
    if(basketId) {
      this.basketSub = this.basketService.getBasket(basketId).subscribe();
    }
  }

  loadUser(): void {
    const token = localStorage.getItem('token');
    this.userSub = this.accountSerice.loadCurrenUser(token).subscribe();
  }
}
