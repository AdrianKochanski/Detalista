import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, ReplaySubject } from 'rxjs';
import configuration from 'src/environments/environment';
import { Address } from '../shared/models/address';
import { User } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrenUser(token: string) {
    if(token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    return this.http.get(configuration.serviceUrls.authApiUrl + 'api/account').pipe(
      map((user: User) => {
        if(user) {
          localStorage.setItem("token", user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  login(values: any) {
    return this.http.post(configuration.serviceUrls.authApiUrl + "api/account/login", values).pipe(
      map((user: User) => {
        if(user) {
          localStorage.setItem("token", user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post(configuration.serviceUrls.authApiUrl + "api/account/register", values).pipe(
      map((user: User) => {
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
    return this.http.get(configuration.serviceUrls.authApiUrl + "api/account/emailexists?email=" + email);
  }

  getUserAddress() {
    return this.http.get<Address>(configuration.serviceUrls.authApiUrl + "api/account/address");
  }

  updateUserAddress(address: Address) {
    return this.http.put<Address>(configuration.serviceUrls.authApiUrl + "api/account/address", address);
  }
}
