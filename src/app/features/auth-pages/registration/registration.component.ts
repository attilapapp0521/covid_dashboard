// register.component.ts
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
  selector: 'app-register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  imports: [UniversalFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  registerFormConfig: FormConfig = {
    title: 'Regisztráció',
    description: 'Hozzon létre új fiókot a COVID adatközponthoz',
    items: [
      {
        type: 'section',
        section: {
          title: 'Fiók létrehozása',
          layout: LayoutType.VERTICAL,
          expanded: true,
          fields: [
            {
              key: 'name',
              type: FieldType.TEXT,
              label: 'Név',
              placeholder: 'Teljes név',
              required: true,
              appearance: 'outline',
              floatLabel: 'always',
              validations: [
                { type: 'required', message: 'A név megadása kötelező' },
                { type: 'minLength', value: 2, message: 'A név túl rövid' },
              ],
            },
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
            {
              key: 'confirmPassword',
              type: FieldType.PASSWORD,
              label: 'Jelszó megerősítése',
              placeholder: '••••••••',
              required: true,
              appearance: 'outline',
              floatLabel: 'always',
              validations: [
                { type: 'required', message: 'Kötelező mező' },
                {
                  type: 'custom',
                  message: 'A jelszavak nem egyeznek',
                  customValidator: (control) => {
                    const group = control.parent;
                    return group?.get('password')?.value === control.value
                      ? null
                      : { mismatch: true };
                  },
                },
              ],
            },
          ],
        },
      },
    ],
    submitLabel: 'Regisztráció',
    secondaryButtonLabel: 'Vissza a bejelentkezéshez',
    secondaryButtonAction: () => this.router.navigate(['/login']),
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  onRegisterSubmit(event: FormSubmitEvent): void {
    if (!event.isValid) return;

    const { name, email, password } = event.formValue;
    this.authService.registration(name as string, email as string, password as string).subscribe({
      next: () => {
        this.snackBar.open('Sikeres regisztráció!', 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      error: (err) => {
        this.snackBar.open(
          typeof err === 'string' ? err : err?.message || 'Ismeretlen hiba történt',
          'Bezár',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          },
        );
      },
    });
  }
}
