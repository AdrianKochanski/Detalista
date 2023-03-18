import { ElementRef, OnInit, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription, map, Observable, retry} from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IBrand } from '../shared/models/brand';
import { FilterParams } from '../shared/models/filterParams';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { CryptoService } from './crypto.service';
import { BigNumber } from "ethers";
import { Dappazon } from '../../../../crypto/typechain-types';

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
    this.subscriptions.push(this.cryptoService.getItems(this.getFilter())
    .subscribe((resp: IPagination) => {
      this.products = resp.data;
      this.shopParams.pageNumber = resp.pageIndex;
      this.shopParams.pageSize = resp.pageSize;
      this.shopParams.itemsCount = resp.count;
    }, error => {
      console.log(error);
    }));
  }

  getFilter(): Dappazon.FilterStruct {
    return {
      brandIdSelected: BigNumber.from(this.shopParams.brandIdSelected),
      categoryIdSelected: BigNumber.from(this.shopParams.typeIdSelected),
      itemsCount: BigNumber.from(this.shopParams.itemsCount),
      pageNumber: BigNumber.from(this.shopParams.pageNumber),
      pageSize: BigNumber.from(this.shopParams.pageSize),
      search: this.shopParams.search,
      sortSelected: this.shopParams.sortSelected
    };
  }

  getBrands() {
    this.subscriptions.push(this.cryptoService.getBrands()
    .subscribe((resp: IBrand[]) => {
      this.brands = [{id: 0, name: 'All'}, ...resp];
    }, error => {
      console.log(error);
    }));
  }

  getTypes() {
    this.subscriptions.push(this.cryptoService.getCategories()
    .subscribe((resp: IType[]) => {
      console.log(resp);
      this.types = [{id: 0, name: 'All'}, ...resp];
    }, error => {
      console.log(error);
    }));
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
