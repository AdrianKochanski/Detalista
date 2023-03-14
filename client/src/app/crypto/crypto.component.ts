import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription, map, Observable} from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IProduct } from '../shared/models/product';
import { CryptoService } from './crypto.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy {
  public products: IProduct[];

  private subscriptions: Subscription[] = [];

  constructor(
    private cryptoService: CryptoService,
    private breadcrumbService: BreadcrumbService,
  ){
    this.breadcrumbService.set('@crypto', 'Address: 0x000...0000');
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

    this.subscriptions.push(this.cryptoService.dappazon$.pipe(
      map(async () => {
        this.getProducts();
      })
    ).subscribe());

    await this.cryptoService.loadDappazonContract();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if(subscription) subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  getProducts() {
    this.cryptoService.getItems(
    ).subscribe((resp: IProduct[]) => {
      this.products = resp;
    }, error => {
      console.log(error);
    });
  }
}
