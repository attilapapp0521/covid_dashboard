// comparison.component.ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { UniversalFormComponent } from '../../../shared/ui/universal-form/universal-form.component';
import { ChartData } from '../../../shared/ui/chart-wrapper/chart-wrapper.component';
import { CovdDataService } from '../covd-data.service';
import { Cases } from '../model/cases.model';
import { Vaccines } from '../model/vaccines.model';
import {
  FieldType,
  FormConfig,
  LayoutType,
} from '../../../shared/ui/universal-form/universal-form-interfaces';
import { COUNTRIES } from '../model/countries.model';
import { MatButton } from '@angular/material/button';

// Új interfészek a típusosság érdekében

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
  imports: [UniversalFormComponent, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonComponent {
  showForm = signal(false);
  activeCharts = signal<ChartData[]>([]);

  readonly casesData = signal<Cases | null>(null);
  readonly vaccinesData = signal<Vaccines | null>(null);

  formConfig: FormConfig = {
    title: 'COVID Adatok Összehasonlítása',
    items: [
      {
        type: 'section',
        section: {
          title: 'Országok kiválasztása',
          icon: 'flag',
          layout: LayoutType.VERTICAL,
          expanded: true,
          fields: [
            {
              required: true,
              key: 'countries',
              type: FieldType.MULTISELECT,
              label: 'Válassz országokat',
              placeholder: 'Válassz országokat',
              options: COUNTRIES.map((c) => ({
                value: c.id,
                label: c.name,
              })),
              validations: [
                { type: 'required', message: 'Legalább egy ország szükséges' },
                { type: 'min', value: 2, message: 'Minimum 2 ország kiválasztása szükséges' },
                { type: 'max', value: 5, message: 'Maximum 5 ország választható' },
              ],
            },
          ],
        },
      },
      {
        type: 'section',
        section: {
          title: 'Metrikák',
          icon: 'analytics',
          layout: LayoutType.GRID,
          expanded: true,
          fields: [
            {
              required: true,
              key: 'metrics',
              type: FieldType.CHECKBOX,
              label: 'Válassz metrikákat',
              options: [
                { value: 'confirmed', label: 'Fertőzött esetek' },
                { value: 'deaths', label: 'Halálozások' },
                { value: 'recovered', label: 'Gyógyultak' },
                { value: 'vaccinated', label: 'Oltottak' },
              ],
              validations: [{ type: 'required', message: 'Legalább egy metrika szükséges' }],
            },
            {
              required: true,
              key: 'metrics',
              type: FieldType.EMAIL,
              label: 'Válassz metrikákat',

              validations: [{ type: 'required', message: 'Legalább egy metrika szükséges' }],
            },
          ],
        },
      },
      {
        type: 'section',
        section: {
          title: 'Vizualizáció',
          icon: 'bar_chart',
          layout: LayoutType.HORIZONTAL,
          expanded: true,
          fields: [
            {
              required: true,
              key: 'chartType',
              type: FieldType.RADIO,
              label: 'Diagram típusa',
              options: [
                { value: 'column', label: 'Oszlop diagram' },
                { value: 'grouped-column', label: 'Csoportosított oszlop' },
                { value: 'pie', label: 'Kördiagram' },
                { value: 'table', label: 'Táblázat', disabled: true },
              ],
              validations: [{ type: 'required', message: 'Diagram típus kötelező' }],
            },
          ],
        },
      },
    ],
    submitLabel: 'Összehasonlítás létrehozása',
    secondaryButtonLabel: 'Mégse',
    secondaryButtonAction: () => this.onSecondaryButtonClick(),
  };

  onSecondaryButtonClick() {
    console.log('onSecondaryButtonClick');
    this.showForm.set(false);
  }

  constructor(private covidService: CovdDataService) {}

  onFormSubmit(formData: unknown) {
    this.showForm.set(false);
  }

  private getMetricLabel(metric: string): string {
    const labels: Record<string, string> = {
      confirmed: 'Fertőzött esetek',
      deaths: 'Halálozások',
      recovered: 'Gyógyultak',
      vaccinated: 'Oltottak',
    };
    return labels[metric] || metric;
  }

  pieChartData = computed(() => [
    {
      name: 'Oltottak',
      value: this.vaccinesData()?.people_vaccinated ?? 0,
    },
    {
      name: 'Nem oltottak',
      value: (this.vaccinesData()?.population ?? 0) - (this.vaccinesData()?.people_vaccinated ?? 0),
    },
  ]);
}
