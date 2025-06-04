import { TestBed } from '@angular/core/testing';

import { CovdDataService } from './covd-data.service';

describe('CovdDataService', () => {
  let service: CovdDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovdDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
