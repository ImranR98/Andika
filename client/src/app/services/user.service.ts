import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { IUser, IUserLogin } from '../models';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
  };

  //Make User data into an Observable
  userSource = new BehaviorSubject(null);
  user = this.userSource.asObservable();
  
  ngOnInit() { }

  //Function to update User Data
  updateUser(user: IUser) {
    this.userSource.next(user);
  }

  registerUser(registerFormInput) {
    return this.http.post(environment.hostUrl + '/register', registerFormInput, this.httpOptions).toPromise();
  }

  completeRegistration(key) {
    return this.http.post(environment.hostUrl + '/completeRegistration', { key: key }, this.httpOptions).toPromise();
  }

  login(loginFormInput: IUserLogin): any {
    return new Promise((resolve, reject) => {
      this.http.post(environment.hostUrl + '/login', loginFormInput, this.httpOptions).toPromise().then((response: any) => {
        if (response.expiresIn && response.idToken && response.user) {
          this.setSession(response);
          this.updateUser(response.user);
          resolve();
        } else {
          reject();
        }
      }).catch((err) => {
        reject(err);
      })
    })
  }

  deleteAccount(deleteAccountFormInput): any {
    return this.http.post(environment.hostUrl + '/deleteAccount', deleteAccountFormInput, this.httpOptions).toPromise();
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isLoggedIn();
  }

  setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('user', JSON.stringify(authResult.user));
  }

  isLoggedIn() {
    if (!moment().isBefore(this.getExpiration())) {
      this.logout();
    }
    this.updateUser(this.getUser());
    return moment().isBefore(this.getExpiration());
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("user");
    this.updateUser(null);
    if (this.router.url !== '/' && this.router.url !== '/home') {
      this.router.navigate(['/']);
    }
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

}