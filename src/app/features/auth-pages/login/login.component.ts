// login.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import {
  FieldType,
  FormConfig,
  FormSubmitEvent,
  LayoutType,
} from '../../../shared/ui/universal-form/universal-form-interfaces';
import { UniversalFormComponent } from '../../../shared/ui/universal-form/universal-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [UniversalFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginFormConfig: FormConfig = {
    title: 'Üdvözöljük!',
    description: 'Kérjük, jelentkezzen be fiókjába',
    items: [
      {
        type: 'section',
        section: {
          title: 'Hitelesítési adatok',
          layout: LayoutType.VERTICAL,
          expanded: true,
          fields: [
            {
              key: 'email',
              type: FieldType.EMAIL,
              label: 'E-mail cím',
              placeholder: 'pelda@email.com',
              required: true,
              appearance: 'outline',
              floatLabel: 'always',
              validations: [
                { type: 'required', message: 'Kötelező mező' },
                { type: 'email', message: 'Érvényes e-mail formátum szükséges' },
              ],
            },
            {
              key: 'password',
              type: FieldType.PASSWORD,
              label: 'Jelszó',
              placeholder: '••••••••',
              required: true,
              appearance: 'outline',
              floatLabel: 'always',
              validations: [
                { type: 'required', message: 'Kötelező mező' },
                { type: 'minLength', value: 8, message: 'Minimum 8 karakter' },
              ],
            },
          ],
        },
      },
    ],
    submitLabel: 'Belépés',
    secondaryButtonLabel: 'Regisztráció',
    secondaryButtonAction: () => this.router.navigate(['/registration']),
  };

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
  ) {}

  onLoginSubmit(form: FormSubmitEvent) {
    if (!form.formValue) {
      console.error(form.formValue);
      return;
    }

    const { email, password } = form.formValue;
    this.authService.login(email as string, password as string).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err),
    });
  }

  private handleSuccess() {
    this.snackBar.open('Sikeres bejelentkezés!', 'OK', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  private handleError(error: string) {
    console.log(error);
    const message = error || 'Ismeretlen hiba történt';
    this.snackBar.open(message, 'Bezár', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
