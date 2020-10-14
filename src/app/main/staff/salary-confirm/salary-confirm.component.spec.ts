import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryConfirmComponent } from './salary-confirm.component';

describe('SalaryConfirmComponent', () => {
  let component: SalaryConfirmComponent;
  let fixture: ComponentFixture<SalaryConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
