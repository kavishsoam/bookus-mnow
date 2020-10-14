import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesbyComponent } from './salesby.component';

describe('SalesbyComponent', () => {
  let component: SalesbyComponent;
  let fixture: ComponentFixture<SalesbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
