import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cases } from './model/cases.model';
import { Observable } from 'rxjs';
import { Vaccines } from './model/vaccines.model';

@Injectable({
  providedIn: 'root',
})
export class CovdDataService {
  private readonly BASE_URL = `https://europe-central2-webuni-js-covid-exam.cloudfunctions.net/`;
  constructor(private readonly http: HttpClient) {}

  getCases(country: string): Observable<Cases> {
    return this.http.get<Cases>(`${this.BASE_URL}cases?country=${country}`);
  }

  getVaccines(country: string): Observable<Vaccines> {
    return this.http.get<Vaccines>(`${this.BASE_URL}vaccines?country=${country}`);
  }
}
