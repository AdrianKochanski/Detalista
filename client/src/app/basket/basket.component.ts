import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  constructor(public basketService: BasketService){}

  ngOnInit(): void {
  }

  removeItem(args: [id: number, quantity: number]) {
    this.basketService.removeItemFromBasket(args[0], args[1]);
  }

  incrementQuantity(item: BasketItem) {
    this.basketService.addItemToBasket(item);
  }
}
