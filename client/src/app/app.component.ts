import { Component, OnInit, HostBinding } from '@angular/core';
import { UserService } from './services/user.service';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Andika';
  @HostBinding('class') componentCssClass;

  constructor(private userService: UserService, public overlayContainer: OverlayContainer) { }

  ngOnInit() {
    this.userService.ifLoggedIn();
  }
}
