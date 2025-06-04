import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';

// Field típusok enum-mal definiálva
export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  TEXTAREA = 'textarea',
  DATE = 'date',
  SWITCH = 'switch',
}

// Layout típusok
export enum LayoutType {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  GRID = 'grid',
}

// Validáció típusok
export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom';
  value?: string | number | RegExp;
  message: string;
  customValidator?: ValidatorFn;
}

// Select/Radio opciók
export interface SelectOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

export type FormItem =
  | { type: 'section'; section: FormSectionConfig }
  | { type: 'field'; field: FormFieldConfig };

// Form field konfiguráció
export interface FormFieldConfig {
  key: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  value?: string | number | boolean | string[] | number[];
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  options?: SelectOption[];
  validations?: ValidationRule[];
  cssClass?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  appearance?: 'fill' | 'outline' | 'legacy' | 'standard';
  floatLabel?: 'auto' | 'always' | 'never';
  showWhen?: {
    field: string;
    value: string | number | boolean | (string | number | boolean)[];
  };
  rows?: number;
  fullWidth?: boolean;
}

// Form szekció konfiguráció
export interface FormSectionConfig {
  title: string;
  description?: string;
  icon?: string;
  expanded?: boolean;
  cssClass?: string;
  layout: LayoutType;
  fields: FormFieldConfig[];
}

// Form konfiguráció
export interface FormConfig {
  title?: string;
  description?: string;
  items: FormItem[];
  submitButtonText?: string;
  cancelButtonText?: string;
  showReset?: boolean;
  cssClass?: string;
  submitLabel?: string;
  secondaryButtonLabel?: string;
  secondaryButtonAction?: () => void;
}

// Form értékek típusa
export type FormValue = Record<string, string | number | boolean | string[] | number[] | undefined>;

// Form events
export interface FormSubmitEvent {
  formValue: FormValue;
  isValid: boolean;
  formConfig: FormConfig;
}

export interface FormChangeEvent {
  fieldKey: string;
  fieldValue: string | number | boolean | string[] | number[] | undefined;
  formValue: FormValue;
  isValid: boolean;
}

export type TypedFormGroup<T extends Record<string, unknown>> = FormGroup<{
  [K in keyof T]: FormControl<T[K]>;
}>;

export interface FormBuilderConfig {
  config: FormConfig;
  initialValue?: Partial<FormValue>;
}

export interface ValidationError {
  field: string;
  message: string;
  value: string | number | boolean | string[] | number[] | undefined;
}
