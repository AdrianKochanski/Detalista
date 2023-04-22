import { Component, Input, OnInit } from '@angular/core';
import { ShopParams } from '../../models/shopParams';
import { Observable, filter } from 'rxjs';
import { ShopService } from 'src/app/shop/shop.service';
import { ShopServiceBase } from '../../helpers/ShopServiceBase';
import { CryptoShopService } from 'src/app/crypto/crypto-shop.service';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
  @Input() isCrypto: boolean = false;
  shopParams$: Observable<ShopParams>;
  firstValue: boolean = false;
  private currentService: ShopServiceBase = null;

  constructor(private shopService: ShopService, private cryptoService: CryptoShopService) {
  }

  ngOnInit(): void {
    if (!this.isCrypto) {
      this.currentService = this.shopService;
    }
    else {
      this.currentService = this.cryptoService;
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

  onPagerChange({page, }: {page: number, itemsPerPage: number}) {
    this.currentService.setShopParams({
      pageNumber: page
    });
  }
}
