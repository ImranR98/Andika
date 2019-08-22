import { Component, OnInit } from '@angular/core';
import { IUser } from '../models';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userExists: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.subscribeToUser();
  }

  subscribeToUser() {
    this.userService.user.subscribe((user: IUser) => {
      if (user) {
        this.userExists = true;
      } else {
        this.userExists = false;
      }
    })
  }

}
