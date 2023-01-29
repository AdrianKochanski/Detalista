import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, of, ReplaySubject } from 'rxjs';
import { baseUrl } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrenUser(token: string) {
    if(token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    return this.http.get(baseUrl + 'account').pipe(
      map((user: IUser) => {
        if(user) {
          localStorage.setItem("token", user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  login(values: any) {
    return this.http.post(baseUrl + "account/login", values).pipe(
      map((user: IUser) => {
        if(user) {
          localStorage.setItem("token", user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post(baseUrl + "account/register", values).pipe(
      map((user: IUser) => {
        if(user) {
          localStorage.setItem("token", user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem("token");
    this.currentUserSource.next(null);
    this.router.navigateByUrl("/");
  }

  checkEmailExist(email: string) {
    return this.http.get(baseUrl + "account/emailexists?email=" + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(baseUrl + "account/address");
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(baseUrl + "account/address", address);
  }
}
