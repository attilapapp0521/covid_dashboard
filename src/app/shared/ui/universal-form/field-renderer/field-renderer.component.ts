// field-renderer.component.ts
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig, FieldType } from '../universal-form-interfaces';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-field-renderer',
  templateUrl: './field-renderer.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSlideToggleModule,
  ],
})
export class FieldRendererComponent {
  @Input() field!: FormFieldConfig;
  @Input() formGroup!: FormGroup;
  FieldType = FieldType;
}
