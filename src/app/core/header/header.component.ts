import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../theme/theme.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatButton, MatIconButton, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    protected readonly themeService: ThemeService,
    private readonly authService: AuthService,
  ) {}

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  get username() {
    return this.authService.currentUser()?.email ?? 'Felhasználó';
  }

  logout() {
    this.authService.logout();
  }
}
