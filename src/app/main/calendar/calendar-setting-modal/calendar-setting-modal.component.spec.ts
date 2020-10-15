import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSettingModalComponent } from './calendar-setting-modal.component';

describe('CalendarSettingModalComponent', () => {
  let component: CalendarSettingModalComponent;
  let fixture: ComponentFixture<CalendarSettingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarSettingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarSettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
