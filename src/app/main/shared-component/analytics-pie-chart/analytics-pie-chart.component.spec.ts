import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsPieChartComponent } from './analytics-pie-chart.component';

describe('AnalyticsPieChartComponent', () => {
  let component: AnalyticsPieChartComponent;
  let fixture: ComponentFixture<AnalyticsPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
