import { ChangeDetectionStrategy, Component, computed, DestroyRef, signal } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { MatButton } from '@angular/material/button';
import { catchError, finalize, forkJoin, tap, throwError } from 'rxjs';
import { CovdDataService } from './covd-data.service';
import { Cases } from './model/cases.model';
import { Vaccines } from './model/vaccines.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CountrySelectComponent,
  SelectedCountry,
} from '../../shared/ui/country-selector/country-select.component';
import { ChartWrapperComponent } from '../../shared/ui/chart-wrapper/chart-wrapper.component';
import { ComparisonComponent } from './comparison/comparison.component';
import { AuthService } from '../../core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent, ModalData } from '../../shared/ui/limited-exceeded-modal/modal.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatTabGroup,
    MatTab,
    KpiCardComponent,
    MatButton,
    CountrySelectComponent,
    ChartWrapperComponent,
    ComparisonComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  selectedCountryId = '';
  readonly casesData = signal<Cases | null>(null);
  readonly vaccinesData = signal<Vaccines | null>(null);

  activeKpiPage = 0; // 0: első 3, 1: második 3

  constructor(
    private readonly covidService: CovdDataService,
    private readonly destroyRef: DestroyRef,
    private readonly authService: AuthService,
    private dialog: MatDialog,
  ) {}

  handleCountrySelection(selectedCountries: SelectedCountry[]) {
    if (selectedCountries.length === 1) {
      this.selectedCountryId = selectedCountries[0].id;
    } else {
      console.error('Could not find country');
    }
  }

  getCasesAndVaccines() {
    if (this.selectedCountryId) {
      forkJoin({
        cases: this.covidService.getCases(this.selectedCountryId),
        vaccinations: this.covidService.getVaccines(this.selectedCountryId),
      })
        .pipe(
          tap(({ cases, vaccinations }) => {
            this.casesData.set(cases);
            this.vaccinesData.set(vaccinations);
          }),
          catchError((err) => throwError(() => new Error(err))),
          finalize(() => this.authService.handleSearchAttempt()),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  readonly ferozesiArany = computed(() => {
    const data = this.casesData();
    if (data?.confirmed && data.population) {
      return +((data.confirmed / data.population) * 100000).toFixed(0);
    }
    return 0;
  });

  readonly halalozasiArany = computed(() => {
    const data = this.casesData();
    if (data?.deaths && data.confirmed) {
      return +((data.deaths / data.confirmed) * 100).toFixed(1);
    }
    return 0;
  });

  readonly oltotsagiArany = computed(() => {
    const data = this.vaccinesData();
    if (data?.people_vaccinated && data.population) {
      return +((data.people_vaccinated / data.population) * 100).toFixed(1);
    }
    return 0;
  });

  readonly adagPerNepesseg = computed(() => {
    const data = this.vaccinesData();
    if (data?.administered && data.population) {
      return +(data.administered / data.population).toFixed(1);
    }
    return 0;
  });

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

  columnChartData = computed(() => [
    {
      name: 'Fertőzöttség',
      data: [this.casesData()?.confirmed ?? 0],
    },
    {
      name: 'Gyógyultak',
      data: [this.casesData()?.recovered ?? 0],
    },
    {
      name: 'Halálozások',
      data: [this.casesData()?.deaths ?? 0],
    },
  ]);

  groupedColumnData = computed(() => [
    {
      name: 'Fertőzöttség',
      data: [this.casesData()?.confirmed ?? 0],
    },
    {
      name: 'Gyógyultak',
      data: [this.casesData()?.recovered ?? 0],
    },
    {
      name: 'Halálozások',
      data: [this.casesData()?.deaths ?? 0],
    },
  ]);

  protected readonly signal = signal;

  onTabChange(index: number) {
    if (index === 1) {
      const config: ModalData = {
        title: 'Tab fejlesztés alatt',
        content: 'Ez a funkció jelenleg fejlesztés alatt áll.',
        confirmText: 'Ok',
      };

      this.dialog.open(ModalComponent, {
        width: '400px',
        disableClose: true,
        data: config,
      });
    }
  }
}
