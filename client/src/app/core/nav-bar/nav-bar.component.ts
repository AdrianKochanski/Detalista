import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { BasketItem } from 'src/app/shared/models/basket';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  currentUser$: Observable<User>;

  constructor(public basketService: BasketService, public accountService: AccountService){}

  logout() {
    this.accountService.logout();
  }

  getCount(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
