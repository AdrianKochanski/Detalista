import { ElementRef, OnInit, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription, map, Observable} from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IBrand } from '../shared/models/brand';
import { FilterParams } from '../shared/models/filterParams';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { CryptoService } from './crypto.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy {
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  public products: IProduct[];
  public brands: IBrand[];
  public types: IType[];
  shopParams: ShopParams = new ShopParams();

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

    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if(subscription) subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  getProducts() {
    this.subscriptions.push(this.cryptoService.getItems(
    ).subscribe((resp: IProduct[]) => {
      this.products = resp;
    }, error => {
      console.log(error);
    }));
  }

  getBrands() {
    // this.shopService.getBrands().subscribe(resp => {
    //   this.brands = [{id: 0, name: 'All'}, ...resp];
    // }, error => {
    //   console.log(error);
    // });
    this.brands = [
      {
        id: 1,
        name: "Brand 1"
      },
      {
        id: 2,
        name: "Brand 2"
      }
    ];
  }

  getTypes() {
    // this.shopService.getTypes().subscribe(resp => {
    //   this.types = [{id: 0, name: 'All'}, ...resp];
    // }, error => {
    //   console.log(error);
    // });
    this.types = [
      {
        id: 1,
        name: "Type 1"
      },
      {
        id: 2,
        name: "Type 2"
      }
    ];
  }

  onFilterSelected(filterParams: FilterParams) {
    console.log(filterParams);
    if(this.shopParams.brandIdSelected !== filterParams.brandIdSelected
      || this.shopParams.typeIdSelected !== filterParams.typeIdSelected
    ) {
      this.shopParams.pageNumber = 1;
    }

    this.shopParams = {
      ...this.shopParams,
      ...filterParams
    }

    this.getProducts();
  }

  onPageChanged(page: number) {
    if(this.shopParams.pageNumber !== page) {
      this.shopParams.pageNumber = page;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = "";
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
