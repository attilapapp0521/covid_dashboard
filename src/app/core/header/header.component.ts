import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatButton, MatIconButton, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isLoggedIn = false;
  username = 'Felhasználó';

  constructor(protected readonly themeService: ThemeService) {}
}
