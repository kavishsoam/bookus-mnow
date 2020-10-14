import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesbyclientComponent } from './salesbyclient.component';

describe('SalesbyclientComponent', () => {
  let component: SalesbyclientComponent;
  let fixture: ComponentFixture<SalesbyclientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesbyclientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesbyclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
