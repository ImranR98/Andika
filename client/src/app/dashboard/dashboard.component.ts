import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { IUser } from '../models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(private errorService: ErrorService, private userService: UserService) { }

  user: IUser | null = null;
  loading: boolean = false;

  userInfoForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required)
  });

  passwordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  deleteAccountForm = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.subscribeToUser();
  }

  deleteAccount() {
    if (confirm('Are you sure you want to permanently delete your account?')) {
      this.loading = true;
      this.userService.deleteAccount(this.deleteAccountForm.controls['password'].value).then(() => {
        this.loading = false;
      }).catch((err: any) => {
        this.loading = false;
      })
    }
  }

  updateUser() {
    this.loading = true;
    this.userService.updateAccount(this.userInfoForm.value).then(() => {
      this.loading = false;
    }).catch((err: any) => {
      this.loading = false;
    })
  }

  updatePassword() {
    this.loading = true;
    if (this.passwordForm.controls['newPassword'].value == this.passwordForm.controls['passwordConfirm'].value) {
      this.userService.updatePassword(this.passwordForm.value).then(() => {
        this.loading = false;
      }).catch((err: any) => {
        this.loading = false;
      })
    } else {
      this.loading = false;
      this.errorService.showSimpleSnackBar('Passwords do not match');
    }
  }

  subscribeToUser() {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.user = user;
        this.userInfoForm.controls['firstName'].setValue(this.user.firstName);
        this.userInfoForm.controls['lastName'].setValue(this.user.lastName);
      }
    })
  }

}