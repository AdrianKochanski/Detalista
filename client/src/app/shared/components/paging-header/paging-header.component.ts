import { Component, Input, OnInit } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { ShopService } from 'src/app/shop/shop.service';
import { ShopParams } from '../../models/shopParams';
import { ShopServiceBase } from '../../helpers/ShopServiceBase';
import { CryptoShopService } from 'src/app/crypto/crypto-shop.service';

@Component({
  selector: 'app-paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss']
})
export class PagingHeaderComponent implements OnInit {
  @Input() isCrypto: boolean = false;
  shopParams$: Observable<ShopParams>;
  firstValue: boolean = false;
  private currentService: ShopServiceBase = null;

  constructor(private shopService: ShopService, private cryptoService: CryptoShopService) {
  }

  ngOnInit(): void {
    if (!this.isCrypto) {
      this.currentService = this.shopService;
      this.shopService.initialize();
    }
    else {
      this.currentService = this.cryptoService;
      this.cryptoService.initialize();
    }

    this.shopParams$ = this.currentService.shopParams$.pipe(
      filter(f => {
        if(!this.firstValue)
        {
          this.firstValue = true;
          return true;
        }
        else {
          return !f.filterChanged;
        }
      })
    );
  }
}
