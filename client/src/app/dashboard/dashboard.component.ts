import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { IUser } from '../models';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
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

  userInfoForm = new UntypedFormGroup({
    firstName: new UntypedFormControl('', Validators.required),
    lastName: new UntypedFormControl('', Validators.required)
  });

  passwordForm = new UntypedFormGroup({
    password: new UntypedFormControl('', Validators.required),
    newPassword: new UntypedFormControl('', Validators.required),
    passwordConfirm: new UntypedFormControl('', Validators.required)
  });

  deleteAccountForm = new UntypedFormGroup({
    password: new UntypedFormControl('', Validators.required)
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