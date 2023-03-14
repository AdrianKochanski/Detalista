import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBrand } from 'src/app/shared/models/brand';
import { FilterParams } from 'src/app/shared/models/filterParams';
import { IType } from 'src/app/shared/models/productType';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent {
  @Input() brands: IBrand[];
  @Input() types: IType[];
  @Output() filterSelected = new EventEmitter<FilterParams>();

  filterParams: FilterParams = new FilterParams();

  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'}
  ];

  onBrandSelected(brandId: number) {
    this.filterParams.brandIdSelected = brandId;
    this.filterSelected.emit(this.filterParams);
  }

  onTypeSelected(typeId: number) {
    this.filterParams.typeIdSelected = typeId;
    this.filterSelected.emit(this.filterParams);
  }

  onSortSelected(sort: string) {
    this.filterParams.sortSelected = sort;
    this.filterSelected.emit(this.filterParams);
  }
}
