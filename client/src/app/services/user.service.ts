import { Injectable, OnInit, Directive } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { IUser, IRegisterUserFormInput, ILoginUserFormInput, IResetPasswordFormInput, IPasswordUpdateFormInput, IAccountUpdateFormInput } from '../models';
import * as moment from 'moment';
import * as jwt_decode from "jwt-decode";
import { ErrorService } from './error.service';

@Directive()
@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
  };

  //Make User data into an Observable
  userSource = new BehaviorSubject(null);
  user = this.userSource.asObservable();

  ngOnInit() { }

  updateUser(user: IUser) {
    this.userSource.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  registerUser(registerFormInput: IRegisterUserFormInput) {
    return new Promise((resolve, reject) => {
      this.http.post('/register', registerFormInput, this.httpOptions).toPromise().then(() => {
        this.errorService.showSimpleSnackBar('Check your email for the link to complete registration');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.registerUser(registerFormInput));
        reject(err);
      })
    })
  }

  resetPassword(resetPasswordFormInput: IResetPasswordFormInput) {
    return new Promise((resolve, reject) => {
      this.http.post('/resetPassword', resetPasswordFormInput, this.httpOptions).toPromise().then(() => {
        this.errorService.showSimpleSnackBar('Check your email for the link to complete password reset');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.resetPassword(resetPasswordFormInput));
        reject(err);
      })
    })
  }

  login(loginFormInput: ILoginUserFormInput): any {
    return new Promise((resolve, reject) => {
      this.http.post('/login', loginFormInput, this.httpOptions).toPromise().then((response: any) => {
        if (response.jwtToken && response.user) {
          localStorage.setItem('jwt_token', response.jwtToken);
          let tokenDecoded = jwt_decode(response.jwtToken);
          localStorage.setItem('jwt_token_decoded', JSON.stringify(tokenDecoded));
          this.updateUser(response.user);
          this.errorService.showSimpleSnackBar('Welcome, ' + this.getJWTUser().firstName);
          resolve();
        } else {
          reject();
        }
      }).catch((err) => {
        this.errorService.showError(err, () => this.login(loginFormInput));
        reject(err);
      })
    })
  }

  deleteAccount(password: string): any {
    return new Promise((resolve, reject) => {
      this.http.post('/deleteAccount', { password }, this.httpOptions).toPromise().then(() => {
        this.logout(true);
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.deleteAccount(password));
        reject(err);
      });
    })
  }

  updatePassword(updatePasswordFormInput: IPasswordUpdateFormInput): any {
    return new Promise((resolve, reject) => {
      this.http.post('/updatePassword', updatePasswordFormInput, this.httpOptions).toPromise().then(() => {
        this.logout(true);
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.updatePassword(updatePasswordFormInput));
        reject(err);
      });
    })
  }

  updateAccount(updateAccountFormInput: IAccountUpdateFormInput): any {
    return new Promise((resolve, reject) => {
      this.http.post('/updateAccount', updateAccountFormInput, this.httpOptions).toPromise().then(() => {
        let userTemp = this.getJWTUser();
        userTemp.firstName = updateAccountFormInput.firstName;
        userTemp.lastName = updateAccountFormInput.lastName;
        this.updateUser(userTemp);
        this.errorService.showSimpleSnackBar('Info Updated');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.updateAccount(updateAccountFormInput));
        reject(err);
      });
    })
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.ifLoggedIn(true);
  }

  ifLoggedIn(redirect: boolean = false) {
    let valid: boolean = (moment().isBefore(this.getJWTExpiration()))
    if (!valid) {
      this.logout(redirect);
    }
    this.updateUser(this.getJWTUser());
    return valid;
  }

  logout(redirect: boolean = true) {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem("jwt_token_decoded");
    localStorage.removeItem("user");
    this.updateUser(null);
    if (redirect) {
      this.router.navigate(['/home']);
    }
  }

  getJWTExpiration() {
    if (JSON.parse(localStorage.getItem("jwt_token_decoded"))) {
      return moment.unix(JSON.parse(localStorage.getItem("jwt_token_decoded")).exp);
    } else {
      return null;
    }
  }

  getJWTUser(): IUser {
    if (JSON.parse(localStorage.getItem("user"))) {
      return JSON.parse(localStorage.getItem("user"));
    } else {
      return null;
    }
  }

}