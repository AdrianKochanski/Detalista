import { Product } from "./product";

export interface IPagination {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Product[];
}
