import { Component, ElementRef, ViewChild } from '@angular/core';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';
import { Observable, map } from 'rxjs';
import { IPagination } from '../shared/models/pagination';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  pagination$: Observable<IPagination>;
  shopParams$: Observable<ShopParams>;

  constructor(private shopService: ShopService) {
    this.pagination$ = shopService.pagination$;
    this.shopParams$ = shopService.shopParams$;
  }

  onSearch() {
    this.shopService.setShopParams({
      search: this.searchTerm.nativeElement.value
    });
  }

  onReset() {
    this.shopService.setShopParams({...new ShopParams()});
    this.searchTerm.nativeElement.value = "";
  }
}
