import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(private dialog: MatDialog, private userService: UserService) { }

  ngOnInit() {
    this.userService.isLoggedIn()
  }

  deleteAccount() {
    this.dialog.open(DeleteAccountDialogComponent, {
      width: '250px',
    });
  }

}