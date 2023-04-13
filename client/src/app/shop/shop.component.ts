import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { FilterParams } from '../shared/models/filterParams';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams: ShopParams;

  constructor(private shopService: ShopService) {
    this.shopParams = shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts().subscribe(resp => {
      this.products = resp.data;
      const params = this.shopService.getShopParams();
      params.pageNumber = resp.pageIndex;
      params.pageSize = resp.pageSize;
      params.itemsCount = resp.count;
      this.shopService.setShopParams(params);
      this.shopParams = params;
    }, error => {
      console.log(error);
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe(resp => {
      this.brands = [{id: 0, name: 'All'}, ...resp];
    }, error => {
      console.log(error);
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe(resp => {
      this.types = [{id: 0, name: 'All'}, ...resp];
    }, error => {
      console.log(error);
    });
  }

  onFilterSelected(filterParams: FilterParams) {
    let params = this.shopService.getShopParams();

    if(params.brandIdSelected !== filterParams.brandIdSelected
      || params.typeIdSelected !== filterParams.typeIdSelected
    ) {
      params.pageNumber = 1;
    }

    params = {
      ...params,
      ...filterParams
    }
    this.shopService.setShopParams(params);
    this.shopParams = params;

    this.getProducts();
  }

  onPageChanged(page: number) {
    const params = this.shopService.getShopParams();

    if(params.pageNumber !== page) {
      params.pageNumber = page;
      this.shopService.setShopParams(params);
      this.shopParams = params;
      this.getProducts();
    }
  }

  onSearch() {
    const params = this.shopService.getShopParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onReset() {
    const params = new ShopParams();
    this.searchTerm.nativeElement.value = "";
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }
}
