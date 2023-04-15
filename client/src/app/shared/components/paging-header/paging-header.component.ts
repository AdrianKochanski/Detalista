import { Component, Input, OnInit } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { CryptoService } from 'src/app/crypto/crypto.service';
import { ShopService } from 'src/app/shop/shop.service';
import { ShopParams } from '../../models/shopParams';
import { ShopServiceBase } from '../../shop/interfaces/ShopServiceBase';

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

  constructor(private shopService: ShopService, private cryptoService: CryptoService) {
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
}
