import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark = signal<boolean>(false);
  private readonly THEME_KEY = 'covid-theme';

  constructor(@Inject(DOCUMENT) private readonly doc: Document) {
    this.initializeTheme();
    this.setupSystemListener();
  }

  get isDarkTheme() {
    return this.isDark();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDark.set(savedTheme ? savedTheme === 'dark' : systemDark);
    this.applyTheme();
  }

  private setupSystemListener() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (!localStorage.getItem(this.THEME_KEY)) {
        this.isDark.set(event.matches);
        this.applyTheme();
      }
    });
  }

  toggleTheme() {
    this.isDark.update((v) => !v);
    localStorage.setItem(this.THEME_KEY, this.isDark() ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    const htmlEl = this.doc.documentElement;
    htmlEl.classList.toggle('dark-theme', this.isDark());
    htmlEl.style.colorScheme = this.isDark() ? 'dark' : 'light';

    htmlEl.style.setProperty('--transition-duration', this.isDark() ? '0.5s' : '0.3s');
  }
}
