import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Basket, BasketItem } from '../../models/basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  @Output() increment: EventEmitter<BasketItem> = new EventEmitter<BasketItem>();
  @Output() remove: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();
  @Input() basket$: Observable<Basket> ;
  @Input() actionsActive: boolean = false;

  constructor(){}

  ngOnInit(): void {}

  removeItem(id: number, quantity: number) {
    this.remove.emit([id, quantity]);
  }

  incrementQuantity(item: BasketItem) {
    this.increment.emit(item);
  }
}
