import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormatNumberPipe } from '../../pipes/format-number.pipe';

export type KpiType = 'health' | 'vaccine' | 'death' | 'recovery' | 'population';

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule, MatCardModule, MatIconModule, FormatNumberPipe],
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  @Input() title = '';
  @Input() value: Signal<number> | undefined;
  @Input() unit = '';
  @Input() icon = 'assessment';
  @Input() type: KpiType = 'health';
  @Input() subtitle = '';
}
