import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';

import {
  FieldType,
  FormChangeEvent,
  FormConfig,
  FormFieldConfig,
  FormItem,
  FormSectionConfig,
  FormSubmitEvent,
  FormValue,
  LayoutType,
  SelectOption,
  ValidationError,
  ValidationRule,
} from './universal-form-interfaces';
import { FieldRendererComponent } from './field-renderer/field-renderer.component';

@Component({
  selector: 'app-universal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FieldRendererComponent,
  ],
  templateUrl: './universal-form.component.html',
  styleUrls: ['./universal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversalFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Inputs
  @Input({ required: true }) config!: FormConfig;
  @Input() initialValue: Partial<FormValue> = {};
  @Input() disabled = false;
  @Input() isHideToggle = false;

  // Outputs
  @Output() formSubmit = new EventEmitter<FormSubmitEvent>();
  @Output() formChange = new EventEmitter<FormChangeEvent>();
  @Output() formReset = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  // Signals
  public readonly formGroup = signal<FormGroup>(new FormGroup({}));
  public readonly isSubmitting = signal<boolean>(false);
  public readonly validationErrors = signal<ValidationError[]>([]);
  public readonly showErrors = signal<boolean>(false);

  // Computed values
  public readonly isFormValid = computed(() => this.formGroup().valid);
  public readonly formValue = computed(() => this.formGroup().value as FormValue);

  // Enum references for template
  public readonly FieldType = FieldType;
  public readonly LayoutType = LayoutType;

  ngOnInit(): void {
    this.buildForm();
    this.setupFormSubscriptions();
    console.log(this.config);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    const formControls: Record<string, FormControl> = {};

    this.getAllFields().forEach((field) => {
      const initialValue = this.getInitialFieldValue(field);
      const validators = this.buildValidators(field);

      formControls[field.key] = new FormControl(
        { value: initialValue, disabled: field.disabled || this.disabled },
        validators,
      );
    });

    this.formGroup.set(this.fb.group(formControls));
  }

  private getAllFields(): FormFieldConfig[] {
    return this.config.items.flatMap((item) =>
      this.isSection(item) ? item.section.fields : [item.field],
    );
  }

  private getInitialFieldValue(
    field: FormFieldConfig,
  ): string | number | boolean | string[] | number[] | null {
    if (this.initialValue && this.initialValue[field.key] !== undefined) {
      return this.initialValue[field.key] ?? null;
    }

    if (field.value !== undefined) {
      return field.value;
    }

    // Default values based on field type
    switch (field.type) {
      case FieldType.CHECKBOX:
      case FieldType.SWITCH:
        return false;
      case FieldType.SELECT:
      case FieldType.MULTISELECT:
        return [];
      case FieldType.NUMBER:
        return null;
      default:
        return null;
    }
  }

  private buildValidators(field: FormFieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.required) validators.push(Validators.required);
    if (field.type === FieldType.EMAIL) validators.push(Validators.email);

    field.validations?.forEach((validation) => {
      const validator = this.createValidator(validation);
      if (validator) validators.push(validator);
    });

    return validators;
  }

  private createValidator(validation: ValidationRule): ValidatorFn | null {
    switch (validation.type) {
      case 'minLength':
        return Validators.minLength(validation.value as number);
      case 'maxLength':
        return Validators.maxLength(validation.value as number);
      case 'min':
        return Validators.min(validation.value as number);
      case 'max':
        return Validators.max(validation.value as number);
      case 'pattern':
        return Validators.pattern(validation.value as string | RegExp);
      case 'custom':
        return validation.customValidator || null;
      default:
        return null;
    }
  }

  private setupFormSubscriptions(): void {
    this.formGroup()
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateValidationErrors();
        this.formChange.emit({
          fieldKey: '',
          fieldValue: undefined,
          formValue: value as FormValue,
          isValid: this.formGroup().valid,
        });
      });
    this.formGroup()
      .statusChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.showErrors()) {
          this.updateValidationErrors();
        }
      });
  }

  private updateValidationErrors(): void {
    const errors: ValidationError[] = [];

    this.getAllFields().forEach((field) => {
      const control = this.formGroup().get(field.key);
      if (control?.errors) {
        Object.keys(control.errors).forEach((errorKey) => {
          errors.push({
            field: field.key,
            message: this.getFieldErrorMessage(field, errorKey, control.errors),
            value: control.value,
          });
        });
      }
    });

    this.validationErrors.set(errors);
  }

  private getErrorMessage(errorKey: string, errorValue: ValidationErrors[string]): string {
    // Generic error messages
    const messages: Record<string, string> = {
      required: 'Ez a mező kötelező',
      email: 'Érvényes email címet adjon meg',
      minlength: `Minimum ${errorValue?.requiredLength} karakter szükséges`,
      maxlength: `Maximum ${errorValue?.requiredLength} karakter engedélyezett`,
      min: `Az érték nem lehet kisebb mint ${errorValue?.min}`,
      max: `Az érték nem lehet nagyobb mint ${errorValue?.max}`,
      pattern: 'Az érték formátuma nem megfelelő',
    };

    return messages[errorKey] || 'Érvénytelen érték';
  }

  private getFieldErrorMessage(
    field: FormFieldConfig,
    errorKey: string,
    errorValue: ValidationErrors | null,
  ): string {
    console.log('getFieldErrorMessage: ', errorValue, errorKey, field);
    return (
      field.validations?.find((v) => v.type === errorKey)?.message ||
      this.getDefaultErrorMessage(errorKey, errorValue)
    );
  }

  public onSubmit(): void {
    this.markAllFieldsAsTouched();
    this.updateValidationErrors();
    this.showErrors.set(true);

    if (this.formGroup().valid) {
      this.isSubmitting.set(true);

      const submitEvent: FormSubmitEvent = {
        formValue: this.formGroup().value as FormValue,
        isValid: true,
        formConfig: this.config,
      };

      this.formSubmit.emit(submitEvent);
      this.isSubmitting.set(false);
    } else {
      console.log('Form is invalid', this.validationErrors());
    }
  }

  public onReset(): void {
    this.formGroup().reset();
    this.validationErrors.set([]);
    this.formReset.emit();
  }

  public onFieldChange(
    fieldKey: string,
    value: string | number | boolean | string[] | number[],
  ): void {
    const control = this.formGroup().get(fieldKey);
    if (control) {
      control.setValue(value);
      control.markAsTouched();

      this.formChange.emit({
        fieldKey,
        fieldValue: value,
        formValue: this.formGroup().value as FormValue,
        isValid: this.formGroup().valid,
      });
    }
  }

  public isFieldVisible(field: FormFieldConfig): boolean {
    if (!field.showWhen) return true;

    const control = this.formGroup().get(field.showWhen.field);
    const value = control?.value;
    const expected = field.showWhen.value;

    return Array.isArray(expected) ? expected.includes(value) : value === expected;
  }

  public getFieldError(fieldKey: string): string | null {
    const control = this.formGroup().get(fieldKey);
    if (!control?.errors) return null;

    const field = this.getAllFields().find((f) => f.key === fieldKey);
    if (!field) return null;

    const firstErrorKey = Object.keys(control.errors)[0];
    return this.getFieldErrorMessage(
      field, // Field config átadása
      firstErrorKey,
      control.errors[firstErrorKey],
    );
  }

  public trackByFieldKey(index: number, field: FormFieldConfig): string {
    return field.key;
  }

  public trackBySectionTitle(index: number, section: FormSectionConfig): string {
    return section.title;
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.formGroup().controls).forEach((fieldKey) => {
      this.formGroup().get(fieldKey)?.markAsTouched();
    });
  }

  // Template helper methods
  public getSelectOptions(field: FormFieldConfig): SelectOption[] {
    return field.options || [];
  }

  public getFieldAppearance(field: FormFieldConfig): 'fill' | 'outline' | 'legacy' | 'standard' {
    return field.appearance || 'outline';
  }

  public getFieldFloatLabel(field: FormFieldConfig): 'auto' | 'always' | 'never' {
    return field.floatLabel || 'auto';
  }

  protected getErrorMessages(field: FormFieldConfig): string[] {
    const control = this.formGroup().get(field.key);
    if (!control?.errors) return [];

    return Object.keys(control.errors).map((errorKey) => {
      const validation = field.validations?.find((v) => v.type === errorKey);
      return (
        validation?.message || this.getDefaultErrorMessage(errorKey, control.errors![errorKey])
      );
    });
  }

  private getDefaultErrorMessage(errorKey: string, errorValue: ValidationErrors | null): string {
    const messages: Record<string, string> = {
      required: 'Ez a mező kötelező',
      email: 'Érvényes email címet adjon meg',
      min: `Minimum ${errorValue?.['min']} karakter szükséges`,
      max: `Maximum value: ${errorValue?.['max']} karakter engedélyezett`,
      minlength: ` Az érték nem lehet kisebb mint ${errorValue?.['requiredLength']}`,
      maxlength: `Az érték nem lehet nagyobb mint ${errorValue?.['requiredLength']}`,
      pattern: 'Az érték formátuma nem megfelelő',
      passwordStrength:
        'A jelszónak tartalmaznia kell: nagybetű, kisbetű, szám és speciális karakter',
    };
    return messages[errorKey] || 'Invalid value';
  }

  public onSecondaryButtonClick(): void {
    if (this.config?.secondaryButtonAction) {
      this.config.secondaryButtonAction();
    }
  }

  isSection(item: FormItem): item is { type: 'section'; section: FormSectionConfig } {
    return item.type === 'section';
  }

  isField(item: FormItem): item is { type: 'field'; field: FormFieldConfig } {
    return item.type === 'field';
  }
}
