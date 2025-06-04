// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './core/header/header.component';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
