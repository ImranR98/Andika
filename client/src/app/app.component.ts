import { Component, OnInit, HostBinding } from '@angular/core';
import { UserService } from './services/user.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Andika';
  @HostBinding('class') componentCssClass;

  constructor(private userService: UserService, public overlayContainer: OverlayContainer, private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.loadStoredIsDark();
    this.subscribeToIsDark();
    this.userService.ifLoggedIn();
  }

  subscribeToIsDark() {
    this.themeService.isDark.subscribe((isDark: boolean) => {
      if (isDark) {
        this.onSetTheme('dark-theme');
      } else {
        this.onSetTheme('light-theme');
      }
    })
  }

  onSetTheme(theme) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }
}
