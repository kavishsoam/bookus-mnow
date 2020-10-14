import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPieChartComponent } from './sales-pie-chart.component';

describe('SalesPieChartComponent', () => {
  let component: SalesPieChartComponent;
  let fixture: ComponentFixture<SalesPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
