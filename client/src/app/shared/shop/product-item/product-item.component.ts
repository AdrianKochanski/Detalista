import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private basketService: BasketService, private cryptoService: CryptoService){}

  ngOnInit(): void {
  }

  navigateToDetails() {
    if(this.product.isCrypto) {
      this.router.navigate([`/crypto/${this.product.id}`]);
    }
    else {
      this.router.navigate([`/shop/${this.product.id}`]);
    }
  }

  addItemToBasket() {
    if(this.product.isCrypto) {
      this.cryptoService.buyItem(this.product).subscribe(response => {
        console.log(response);
      }, e => this.cryptoService.parseMetamaskError(e));
    }
    else {
      this.basketService.addItemToBasket(this.product);
    }
  }
}
