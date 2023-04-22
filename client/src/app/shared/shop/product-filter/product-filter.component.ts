import { Component, Input, OnInit } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { IBrand } from 'src/app/shared/models/brand';
import { IType } from 'src/app/shared/models/productType';
import { ShopService } from 'src/app/shop/shop.service';
import { ShopParams } from '../../models/shopParams';
import { ShopServiceBase } from '../../helpers/ShopServiceBase';
import { CryptoShopService } from 'src/app/crypto/crypto-shop.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  @Input() isCrypto: boolean = false;
  shopParams$: Observable<ShopParams>;
  brands$: Observable<IBrand[]>;
  types$: Observable<IType[]>;
  firstValue: boolean = false;
  private currentService: ShopServiceBase = null;

  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'}
  ];

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
          return f.filterChanged;
        }
      }),
    );
    this.brands$ = this.currentService.brands$;
    this.types$ = this.currentService.types$;
  }

  onBrandSelected(brandId: number) {
    this.currentService.setShopParams({
      brandIdSelected: brandId
    });
  }

  onTypeSelected(typeId: number) {
    this.currentService.setShopParams({
      typeIdSelected: typeId
    });
  }

  onSortSelected(sort: string) {
    this.currentService.setShopParams({
      sortSelected: sort
    });
  }
}
