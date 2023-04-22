import { ElementRef, OnInit, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription, map, Observable, retry, tap} from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IPagination } from '../shared/models/pagination';
import { ShopParams } from '../shared/models/shopParams';
import { CryptoShopService } from './crypto-shop.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy {
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  pagination$: Observable<IPagination>;
  shopParams$: Observable<ShopParams>;

  private subscriptions: Subscription[] = [];

  constructor(
    private cryptoService: CryptoShopService,
    private breadcrumbService: BreadcrumbService,
  ){
    this.pagination$ = cryptoService.pagination$;
    this.shopParams$ = cryptoService.shopParams$;
    this.breadcrumbService.set('@crypto', 'Address: 0x000...0000');
    this.cryptoService.initialize();
  }

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(this.cryptoService.account$.pipe(
      map((address) => {
        if(address.length >= 42) {
          this.breadcrumbService.set('@crypto', `Address: ${address.slice(0,5)}...${address.slice(38)}`);
        }
      })
    ).subscribe());

    await this.cryptoService.fetchEthereumAddress();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if(subscription) subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  onSearch() {
    this.cryptoService.setShopParams({
      search: this.searchTerm.nativeElement.value
    });
  }

  onReset() {
    this.cryptoService.setShopParams({...new ShopParams()});
    this.searchTerm.nativeElement.value = "";
  }
}
