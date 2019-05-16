import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ILoginUser } from 'src/app/models';
import { UserService } from 'src/app/services/user.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.sass']
})
export class DeleteAccountDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteAccountDialogComponent>, private userService: UserService, private errorService: ErrorService) { }

  deleteForm = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  loading: boolean = false;

  ngOnInit() { }

  delete() {
    let deleteAccountFormData: ILoginUser = {
      email: this.userService.getUser().email,
      password: this.deleteForm.controls['password'].value
    }
    this.loading = true;
    this.userService.deleteAccount(deleteAccountFormData).then(() => {
      this.loading = false;
      this.userService.logout();
      this.dialogRef.close();
    }).catch((err) => {
      this.loading = false;
      this.errorService.showError(err);
      this.dialogRef.close();
    })
  }

  close() {
    this.dialogRef.close();
  }

}