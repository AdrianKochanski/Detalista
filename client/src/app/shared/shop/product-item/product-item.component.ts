import { Component, Input, OnInit } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { CryptoService } from 'src/app/crypto/crypto.service';
import { IProduct } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() product: IProduct;
  @Input() isCrypto: boolean = false;

  constructor(private basketService: BasketService, private cryptoService: CryptoService){}

  ngOnInit(): void {
  }

  addItemToBasket() {
    if(this.isCrypto) {
      this.cryptoService.buyItem(this.product).subscribe(response => {
        console.log(response);
      }, e => this.cryptoService.parseMetamaskError(e));
    }
    else {
      this.basketService.addItemToBasket(this.product);
    }
  }
}
