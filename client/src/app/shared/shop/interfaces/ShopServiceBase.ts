import { BehaviorSubject, Observable, map, of } from "rxjs";
import { ShopParams, shopParamsKey } from "../../models/shopParams";
import { IProduct } from "../../models/product";
import { IPagination } from "../../models/pagination";
import { IType } from "../../models/productType";
import { IBrand } from "../../models/brand";

export class ShopServiceBase {
  productsCache = new Map();

  paginationSource = new BehaviorSubject<IPagination | null>(null);
  pagination$ = this.paginationSource.asObservable();

  private shopParamsSource = new BehaviorSubject<ShopParams>(new ShopParams());
  shopParams$ = this.shopParamsSource.asObservable();

  private typesSource = new BehaviorSubject<IType[]>([]);
  types$ = this.typesSource.asObservable();

  private brandsSource = new BehaviorSubject<IBrand[]>([]);
  brands$ = this.brandsSource.asObservable();

  constructor(){}

  setShopParams(params: Partial<ShopParams>): ShopParams {
    if(  params.brandIdSelected !== undefined && params.brandIdSelected !== this.shopParamsSource.value.brandIdSelected
      || params.typeIdSelected !== undefined && params.typeIdSelected !== this.shopParamsSource.value.typeIdSelected
      || params.search !== undefined && params.search !== this.shopParamsSource.value.search
    ) {
      //console.log(1);
      params.pageNumber = 1;
      params.filterChanged = true;
    }
    else if(
         params.pageNumber !== undefined && params.pageNumber !== this.shopParamsSource.value.pageNumber
      || params.sortSelected !== undefined && params.sortSelected !== this.shopParamsSource.value.sortSelected
    ) {
      //console.log(2);
      params.filterChanged = true;
    }
    else if (params.filterChanged === undefined) {
      //console.log(3);
      params.filterChanged = false;
    }

    //console.log(params);
    const nextShopParams = {
      ...this.shopParamsSource.value,
      ...params
    };

    this.shopParamsSource.next(nextShopParams);
    return nextShopParams;
  }

  getCachedProduct(getT: (id: number) => Observable<IProduct>, id: number): Observable<IProduct> {
    if(!!this.paginationSource.value) {
      const product = this.paginationSource.value.data.find(p => p.id == id);
      if(product) return of(product);
    }

    return getT(id);
  }

  getCachedBrands(getT: () => Observable<IBrand[]>): Observable<void> {
    return getT().pipe(
      map(b => {
        b.unshift({id: 0, name: 'All'});
        this.brandsSource.next(b);
      })
    );
  }

  getCachedTypes(getT: () => Observable<IType[]>): Observable<void> {
    return getT().pipe(
      map(t => {
        t.unshift({id: 0, name: 'All'});
        this.typesSource.next(t);
      })
    );
  }

  protected getCachedProducts(getT: () => Observable<IPagination>, shopParams: ShopParams, useCache = true): Observable<void> {
    let getProductsObservable: Observable<IPagination> = undefined;
    if(!useCache) this.productsCache = new Map();

    if(this.productsCache.size > 0 && useCache) {
      const paramsKey = shopParamsKey(shopParams);

      if(this.productsCache.has(paramsKey)) {
        getProductsObservable = of(this.productsCache.get(paramsKey));
      }
    }

    if(getProductsObservable === undefined) {
      getProductsObservable = getT();
    }

    return getProductsObservable.pipe(
      map(p => {
        const updatedParams = this.setShopParams({
          pageNumber: p.pageIndex,
          pageSize: p.pageSize,
          itemsCount: p.count
        });

        const paramsKey = shopParamsKey(updatedParams);
        console.log(this.productsCache);

        if(!this.productsCache.has(paramsKey)) {
          this.productsCache.set(paramsKey, p);
        }

        this.paginationSource.next(p);
      })
    );
  }
}
