// chart-wrapper-component.ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

export type ChartType = 'pie' | 'column' | 'grouped-column';

export interface ChartData {
  name: string;
  value: number;
}

export interface SeriesData {
  name: string;
  data: number[];
}

@Component({
  selector: 'app-chart-wrapper',
  templateUrl: './chart-wrapper.component.html',
  styleUrls: ['./chart-wrapper.component.scss'],
  imports: [HighchartsChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartWrapperComponent {
  // Input signal-ek használata @Input helyett
  type = input.required<ChartType>();
  data = input.required<ChartData[] | SeriesData[]>();
  categories = input<string[]>();
  title = input<string>('');

  Highcharts: typeof Highcharts = Highcharts;

  // Computed signal a chart options-hoz
  chartOptions = computed(() => {
    switch (this.type()) {
      case 'pie':
        return this.createPieChart();
      case 'column':
        return this.createColumnChart();
      case 'grouped-column':
        return this.createGroupedColumnChart();
      default:
        return {};
    }
  });

  // updateFlag signal a Highcharts frissítéséhez
  updateFlag = computed(() => {
    // Ez automatikusan változik, amikor bármely dependency változik
    this.chartOptions();
    return true;
  });

  private createPieChart(): Highcharts.Options {
    return {
      chart: { type: 'pie' },
      title: { text: this.title() },
      series: [
        {
          type: 'pie',
          name: 'Megoszlás',
          data: (this.data() as ChartData[]).map((item) => ({
            name: item.name,
            y: item.value,
          })),
        },
      ],
    };
  }

  private createColumnChart(): Highcharts.Options {
    return {
      chart: { type: 'column' },
      title: { text: this.title() },
      xAxis: {
        type: 'category',
        title: { text: 'Kategóriák' },
      },
      yAxis: {
        title: {
          text: 'Fő',
          align: 'high',
          rotation: 0,
          y: -20,
        },
      },
      plotOptions: {
        column: {
          minPointLength: 5,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.y === 0 ? '0' : '';
            },
          },
        },
      },
      series: (this.data() as SeriesData[]).map((series) => ({
        type: 'column',
        name: series.name,
        data: series.data,
      })),
    };
  }

  private createGroupedColumnChart(): Highcharts.Options {
    return {
      chart: { type: 'column' },
      title: { text: this.title() },
      xAxis: { categories: this.categories() },
      plotOptions: {
        column: { grouping: true },
      },
      tooltip: {
        shared: true,
        formatter: function () {
          return `<b>${this.x}</b><br/>${this.series.name}: ${this.y}`;
        },
      },
      series: (this.data() as SeriesData[]).map((series) => ({
        type: 'column',
        name: series.name,
        data: series.data,
      })),
    };
  }
}
