import { Component, Input, Output, EventEmitter, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';

export interface Country {
  id: string;
  name: string;
  code: string;
  flagEmoji: string;
}

export interface SelectedCountry {
  id: string;
  name: string;
}

@Component({
  selector: 'app-country-select',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
  ],
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountrySelectComponent implements OnInit {
  @Input() countries: Country[] = [
    { id: 'hungary', name: 'Magyarország', code: 'HU', flagEmoji: '🇭🇺' },
    { id: 'austria', name: 'Ausztria', code: 'AT', flagEmoji: '🇦🇹' },
    { id: 'slovakia', name: 'Szlovákia', code: 'SK', flagEmoji: '🇸🇰' },
    { id: 'romania', name: 'Románia', code: 'RO', flagEmoji: '🇷🇴' },
    { id: 'slovenia', name: 'Szlovénia', code: 'SI', flagEmoji: '🇸🇮' },
    { id: 'france', name: 'Franciaország', code: 'FR', flagEmoji: '🇫🇷' },
  ];
  @Input() mode: 'single' | 'multi' = 'single';
  @Input() maxSelection?: number;
  @Input() placeholder = 'Válassz országot...';
  @Input() label = 'Országok';

  @Input() value: SelectedCountry[] = [];
  @Output() valueChange = new EventEmitter<SelectedCountry[]>();

  searchQuery = signal<string>('');
  filteredCountries = signal<Country[]>([]);

  ngOnInit() {
    this.filteredCountries.set([...this.countries]);
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query.toLowerCase());
    this.filteredCountries.set(
      this.countries.filter(
        (c) =>
          c.name.toLowerCase().includes(this.searchQuery()) ||
          c.code.toLowerCase().includes(this.searchQuery()) ||
          c.id.toLowerCase().includes(this.searchQuery()),
      ),
    );
  }

  onSelectionChange(ids: string[] | string) {
    const selectedIds = Array.isArray(ids) ? ids : [ids];

    const newValue = selectedIds
      .map((id) => this.countries.find((c) => c.id === id))
      .filter(Boolean)
      .map((country) => ({ id: country!.id, name: country!.name }));

    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  isOptionDisabled(country: Country): boolean {
    if (this.mode === 'multi' && this.maxSelection) {
      return this.value.length >= this.maxSelection && !this.value.some((v) => v.id === country.id);
    }
    return false;
  }

  removeCountry(id: string) {
    this.onSelectionChange(this.value.filter((v) => v.id !== id).map((v) => v.id));
  }

  getCountryById(id: string): Country | undefined {
    return this.countries.find((c) => c.id === id);
  }
}
