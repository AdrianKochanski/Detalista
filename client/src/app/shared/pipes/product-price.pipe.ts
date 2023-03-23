import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../models/product';

@Pipe({
  name: 'productPrice'
})
export class ProductPricePipe implements PipeTransform {

  transform(product: IProduct, quantity: number): string {
    let amount = product.price;

    if(quantity) {
      amount *= quantity;
    }

    if(product.isCrypto) {
      return `${amount} ETH`;
    }
    else {
      return `$${amount}`;
    }
  }
}
