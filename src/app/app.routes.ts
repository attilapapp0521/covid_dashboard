import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth-pages/login/login.component';
import { RegistrationComponent } from './features/auth-pages/registration/registration.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.routes),
  },
];
