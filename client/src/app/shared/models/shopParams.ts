export function shopParamsKey(params: ShopParams) {
    return `${params.brandIdSelected}-${params.typeIdSelected}-${params.sortSelected}-${params.pageNumber}-${params.pageSize}-${params.search}`;
}

export class ShopParams {
  // filters
  brandIdSelected: number = 0;
  typeIdSelected: number = 0;
  sortSelected = 'name';
  search: string = "";
  pageNumber = 1;
  // paging
  pageSize = 6;
  itemsCount = 0;
  filterChanged: boolean = true;
}
