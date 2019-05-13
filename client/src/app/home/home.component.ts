import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from '../services/error.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUserLogin, IUserRegister, IUser } from '../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registerForm = new FormGroup({
    email: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  user: IUser = null;
  loading: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private errorService: ErrorService, private userService: UserService) { }

  ngOnInit() {
    this.userService.user.subscribe((user) => {
      this.user = user;
    })
    this.checkForRegistrationCompletionKey();
  }

  checkForRegistrationCompletionKey() {
    if (this.activatedRoute.snapshot.queryParamMap.get('key')) {
      this.loading = true;
      this.userService.completeRegistration(this.activatedRoute.snapshot.queryParamMap.get('key')).then(() => {
        this.loading = false;
        this.errorService.showSimpleSnackBar('Registered Succesfully');
      }).catch((err) => {
        this.loading = false;
        this.errorService.showError(err);
      })
    }
  }

  login() {
    let loginUserData: IUserLogin = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    }
    this.loading = true;
    this.userService.login(loginUserData).then(() => {
      this.loading = false;
    }).catch((err) => {
      this.loading = false;
      this.errorService.showError(err);
    })
  }

  register() {
    if (this.registerForm.controls['password'].value == this.registerForm.controls['passwordConfirm'].value) {
      let registerUserData: IUserRegister = {
        email: this.registerForm.controls['email'].value,
        firstName: this.registerForm.controls['firstName'].value,
        lastName: this.registerForm.controls['lastName'].value,
        password: this.registerForm.controls['password'].value
      }
      this.loading = true;
      this.userService.registerUser(registerUserData).then(() => {
        this.loading = false;
        this.errorService.showSimpleSnackBar('Check your email for the link to complete registration');
        this.registerForm.reset();
      }).catch((err) => {
        this.loading = false;
        this.errorService.showError(err);
      })
    } else {
      this.errorService.showSimpleSnackBar('Passwords do not match');
    }
  }

}
