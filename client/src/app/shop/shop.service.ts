import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShopServiceBase } from '../shared/helpers/ShopServiceBase';
import configuration from 'src/environments/environment';
import { ProductType } from '../shared/models/productType';
import { ProductBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { filter, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService extends ShopServiceBase {
  private initialized: boolean = false;

  initialize() {
    if(this.initialized) {
      return;
    }
    else {
      this.initialized = true;
    }

    this.getCachedBrands(() => {
      return this.http.get<ProductBrand[]>(configuration.serviceUrls.apiUrl + 'api/products/brands');
    }).subscribe(() => {
    }, error => {
      console.log(error);
    });

    this.getCachedTypes(() => {
      return this.http.get<ProductType[]>(configuration.serviceUrls.apiUrl + 'api/products/types');
    }).subscribe(() => {
    }, error => {
      console.log(error);
    });

    this.shopParams$.pipe(
      filter(f => f.filterChanged),
      switchMap(shopParams => this.getCachedProducts(
        () => {
          let params = new HttpParams();

          if(shopParams.brandIdSelected !== 0) {
            params = params.append("brandId", shopParams.brandIdSelected.toString());
          }

          if(shopParams.typeIdSelected !== 0) {
            params = params.append("typeId", shopParams.typeIdSelected.toString());
          }

          if (shopParams.search) {
            params = params.append("search", shopParams.search);
          }

          params = params.append("sort", shopParams.sortSelected);
          params = params.append("pageIndex", shopParams.pageNumber.toString());
          params = params.append("pageSize", shopParams.pageSize.toString());

          return this.http.get<IPagination>(configuration.serviceUrls.apiUrl + 'api/products', {observe: 'response', params}).pipe(map(r => r.body));
        },
        shopParams,
        true
      ))
    ).subscribe(() => {
    }, error => {
      console.log(error);
    });
  }

  constructor(private http: HttpClient) {
    super();
  }

  getProduct(id: number) {
    return this.getCachedProduct(
      (id: number) => {
        return this.http.get<Product>(`${configuration.serviceUrls.apiUrl}api/products/${id}`);
      },
      id
    );
  }
}
