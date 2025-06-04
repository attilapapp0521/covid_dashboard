import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitedExceededModalComponent } from './limited-exceeded-modal.component';

describe('LimitedExceededModalComponent', () => {
  let component: LimitedExceededModalComponent;
  let fixture: ComponentFixture<LimitedExceededModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitedExceededModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitedExceededModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
