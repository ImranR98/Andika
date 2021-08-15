import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorService } from '../services/error.service';
import { UserService } from '../services/user.service';
import { IRegisterUserFormInput, ILoginUserFormInput } from '../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
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

  resetPasswordForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  loading: boolean = false;

  constructor(private errorService: ErrorService, private userService: UserService) { }

  ngOnInit() {
  }



  login() {
    let loginUserData: ILoginUserFormInput = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    }
    this.loading = true;
    this.userService.login(loginUserData).then(() => {
      this.loading = false;
    }).catch((err: any) => {
      this.loading = false;
    })
  }

  register() {
    if (this.registerForm.valid) {
      if (this.registerForm.controls['password'].value == this.registerForm.controls['passwordConfirm'].value) {
        let registerUserData: IRegisterUserFormInput = this.registerForm.value;
        this.loading = true;
        this.userService.registerUser(registerUserData).then(() => {
          this.loading = false;
          this.registerForm.reset();
        }).catch((err) => {
          this.loading = false;
        })
      } else {
        this.errorService.showSimpleSnackBar('Passwords do not match');
      }
    } else {
      this.errorService.showSimpleSnackBar('Please fill all fields and provide a valid password');
    }

  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.controls['password'].value == this.resetPasswordForm.controls['passwordConfirm'].value) {
        let resetPasswordData: IRegisterUserFormInput = this.resetPasswordForm.value;
        this.loading = true;
        this.userService.resetPassword(resetPasswordData).then(() => {
          this.loading = false;
          this.resetPasswordForm.reset();
        }).catch((err) => {
          this.loading = false;
        })
      } else {
        this.errorService.showSimpleSnackBar('Passwords do not match');
      }
    } else {
      this.errorService.showSimpleSnackBar('Please fill all fields and provide a valid password');
    }

  }

}
