import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
  standalone: true,
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('hu-HU').format(value);
  }
}
