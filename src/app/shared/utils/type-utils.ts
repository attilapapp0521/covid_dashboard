
export interface CovidTestData {
  country: string;
  confirmed: number;
  recovered: number;
  deaths: number;
  vaccinated?: number;
}

export interface CovidData {
  country: string;
  confirmed: number;
  recovered: number;
  deaths: number;
  population: number;
}

export function assertCovidData(data: unknown): asserts data is CovidTestData[] {
  if (!Array.isArray(data) || data.some((item) => !item.confirmed)) {
    throw new Error('Invalid COVID data structure');
  }
}
