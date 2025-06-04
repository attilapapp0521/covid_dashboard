// auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LimitExceededModalComponent } from '../../shared/ui/limited-exceeded-modal/limited-exceeded-modal.component';

interface User {
  email: string;
  passwordHash: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ATTEMPTS_KEY = 'search_attempts';
  private readonly usersKey = 'covid_dashboard_users';
  private readonly tokenKey = 'covid_dashboard_token';

  private _currentUser = signal<User | null>(null);
  private loading = signal(false);
  private _error = signal<string | null>(null);

  currentUser = computed(() => this._currentUser());
  isLoading = computed(() => this.loading());
  error = computed(() => this._error());

  constructor(
    private readonly router: Router,
    private dialog: MatDialog,
  ) {
    this.autoLogin();
  }

  get isLoggedIn() {
    return !!this._currentUser();
  }

  private get users(): User[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  private set users(users: User[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  private autoLogin(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const user = this.users.find((u) => u.token === token);
      if (user) this._currentUser.set(user);
    }
  }

  handleSearchAttempt(): void {
    if (this.isLoggedIn) return;

    const attempts = this.getAttempts() + 1;
    localStorage.setItem(this.ATTEMPTS_KEY, attempts.toString());

    if (attempts >= 3) {
      this.showLimitModal();
      this.router.navigate(['/login']);
    }
  }

  private showLimitModal(): void {
    this.dialog.open(LimitExceededModalComponent, {
      width: '400px',
      disableClose: true,
    });
  }

  getAttempts(): number {
    return parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || '0');
  }

  registration(name: string, email: string, password: string): Observable<void> {
    this.loading.set(true);
    this._error.set(null);

    return from(this.hashPassword(password)).pipe(
      switchMap((passwordHash) => {
        if (this.users.some((u) => u.email === email)) {
          return throwError(() => 'Ez az email cím már foglalt');
        }

        const newUser: User = {
          email,
          passwordHash,
          token: this.generateToken(),
        };

        this.users = [...this.users, newUser];
        localStorage.setItem(this.tokenKey, newUser.token);
        this._currentUser.set(newUser);
        this.router.navigate(['/dashboard']);

        return of(undefined);
      }),
      catchError((error) => {
        this._error.set(error.message || 'Ismeretlen hiba történt');
        return throwError(() => error);
      }),
      tap(() => this.loading.set(false)),
    );
  }

  login(email: string, password: string): Observable<void> {
    this.loading.set(true);
    this._error.set(null);

    return from(this.hashPassword(password)).pipe(
      switchMap((passwordHash) => {
        const user = this.users.find((u) => u.email === email && u.passwordHash === passwordHash);

        console.log(user);
        if (!user) {
          return throwError(() => 'Hibás email cím vagy jelszó');
        }

        localStorage.setItem(this.tokenKey, user.token);
        this._currentUser.set(user);
        this.router.navigate(['/dashboard']);
        return of(undefined);
      }),
      catchError((error) => {
        this._error.set(error.message || 'Bejelentkezési hiba');
        return throwError(() => error);
      }),
      tap(() => this.loading.set(false)),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private generateToken(): string {
    return crypto.randomUUID();
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
