import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    // tslint:disable-next-line: object-literal-shorthand
    const authData: AuthData = {email: email, password: password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
  });
}
login(email: string, password: string) {
  // tslint:disable-next-line: object-literal-shorthand
  const authData: AuthData = {email: email, password: password};
  this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
 .subscribe(response => {
const token = response.token;
this.token = token;
if (token) {
  const expiresInDuration = response.expiresIn;
  this.tokenTimer = window.setTimeout(() => {
   this.logout();
 }, expiresInDuration * 1000);
  this.isAuthenticated = true;
  this.authStatusListener.next(true);
  this.router.navigate(['/']);
}
});
}
logout() {
  this.token = null;
  this.isAuthenticated = false;
  this.authStatusListener.next(false);
  this.router.navigate(['/']);
  clearTimeout(this.tokenTimer);
}
}
