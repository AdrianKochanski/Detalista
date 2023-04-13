import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import configuration from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  pagination?: IPagination;
  shopParams = new ShopParams();

  constructor(private http: HttpClient) { }

  getProducts(useCache = true): Observable<IPagination> {
    let params = new HttpParams();

    if(this.shopParams.brandIdSelected !== 0) {
      params = params.append("brandId", this.shopParams.brandIdSelected.toString());
    }

    if(this.shopParams.typeIdSelected !== 0) {
      params = params.append("typeId", this.shopParams.typeIdSelected.toString());
    }

    if (this.shopParams.search) {
      params = params.append("search", this.shopParams.search);
    }

    params = params.append("sort", this.shopParams.sortSelected);
    params = params.append("pageIndex", this.shopParams.pageNumber.toString());
    params = params.append("pageSize", this.shopParams.pageSize.toString());

    return this.http.get<IPagination>(configuration.baseUrl + 'products', {observe: 'response', params})
    .pipe(
      map(r => {
        this.pagination = r.body;
        return r.body;
      })
    );
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams(): ShopParams {
    return this.shopParams;
  }

  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${configuration.baseUrl}products/${id}`);
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(configuration.baseUrl + 'products/brands');
  }

  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(configuration.baseUrl + 'products/types');
  }
}
