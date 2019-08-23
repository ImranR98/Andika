import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;
  isDark: boolean = true;

  constructor(private userService: UserService, private themeService: ThemeService) { }

  ngOnInit() {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    })
    this.themeService.isDark.subscribe((isDark) => {
      this.isDark = isDark;
    })
  }

  toggleIsDark() {
    this.themeService.toggleIsDark();
  }

  logout() {
    this.userService.logout();
  }

}
