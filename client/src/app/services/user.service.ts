import { Injectable, OnInit, Directive } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { IUser, IRegisterUserFormInput, ILoginUserFormInput, IResetPasswordFormInput, IPasswordUpdateFormInput, IAccountUpdateFormInput } from '../models';
import * as moment from 'moment';
import { ErrorService } from './error.service';
import jwtDecode from 'jwt-decode'

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
  userSource = new BehaviorSubject<IUser | null>(null);
  user = this.userSource.asObservable();

  ngOnInit() { }

  updateUser(user: IUser | null) {
    this.userSource.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  registerUser(registerFormInput: IRegisterUserFormInput) {
    return new Promise<void>((resolve, reject) => {
      firstValueFrom(this.http.post('/api/register', registerFormInput, this.httpOptions)).then(() => {
        this.errorService.showSimpleSnackBar('Check your email for the link to complete registration');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.registerUser(registerFormInput));
        reject(err);
      })
    })
  }

  resetPassword(resetPasswordFormInput: IResetPasswordFormInput) {
    return new Promise<void>((resolve, reject) => {
      firstValueFrom(this.http.post('/api/resetPassword', resetPasswordFormInput, this.httpOptions)).then(() => {
        this.errorService.showSimpleSnackBar('Check your email for the link to complete password reset');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.resetPassword(resetPasswordFormInput));
        reject(err);
      })
    })
  }

  login(loginFormInput: ILoginUserFormInput): any {
    return new Promise<void>((resolve, reject) => {
      firstValueFrom(this.http.post('/api/login', loginFormInput, this.httpOptions)).then((response: any) => {
        if (response.jwtToken && response.user) {
          localStorage.setItem('jwt_token', response.jwtToken);
          let tokenDecoded = jwtDecode(response.jwtToken);
          localStorage.setItem('jwt_token_decoded', JSON.stringify(tokenDecoded));
          this.updateUser(response.user);
          this.errorService.showSimpleSnackBar('Welcome, ' + this.getJWTUser()?.firstName);
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
    return new Promise<void>((resolve, reject) => {
      firstValueFrom(this.http.post('/api/deleteAccount', { password }, this.httpOptions)).then(() => {
        this.logout(true);
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.deleteAccount(password));
        reject(err);
      });
    })
  }

  updatePassword(updatePasswordFormInput: IPasswordUpdateFormInput): any {
    return new Promise<void>((resolve, reject) => {
      firstValueFrom(this.http.post('/api/updatePassword', updatePasswordFormInput, this.httpOptions)).then(() => {
        this.logout(true);
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.updatePassword(updatePasswordFormInput));
        reject(err);
      });
    })
  }

  updateAccount(updateAccountFormInput: IAccountUpdateFormInput): any {
    return new Promise<void>((resolve, reject) => {
      firstValueFrom(this.http.post('/api/updateAccount', updateAccountFormInput, this.httpOptions)).then(() => {
        let userTemp = this.getJWTUser();
        if (userTemp) {
          userTemp.firstName = updateAccountFormInput.firstName;
          userTemp.lastName = updateAccountFormInput.lastName;
          this.updateUser(userTemp);
          this.errorService.showSimpleSnackBar('Info Updated');
        }
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
    if (JSON.parse(localStorage.getItem("jwt_token_decoded") || 'null')) {
      return moment.unix(JSON.parse(localStorage.getItem("jwt_token_decoded") || 'null')?.exp);
    } else {
      return null;
    }
  }

  getJWTUser(): IUser | null {
    if (JSON.parse(localStorage.getItem("user") || 'null')) {
      return JSON.parse(localStorage.getItem("user") || 'null');
    } else {
      return null;
    }
  }

}