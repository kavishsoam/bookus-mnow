import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTimeSlotsComponent } from './select-time-slots.component';

describe('SelectTimeSlotsComponent', () => {
  let component: SelectTimeSlotsComponent;
  let fixture: ComponentFixture<SelectTimeSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTimeSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTimeSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
