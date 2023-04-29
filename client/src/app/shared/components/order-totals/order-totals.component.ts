import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketTotals } from '../../models/basket';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit{
  @Input() basketTotal$: Observable<BasketTotals>;

  constructor(){}

  ngOnInit(): void {}
}
