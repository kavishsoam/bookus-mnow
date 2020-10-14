import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesbylocationComponent } from './salesbylocation.component';

describe('SalesbylocationComponent', () => {
  let component: SalesbylocationComponent;
  let fixture: ComponentFixture<SalesbylocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesbylocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesbylocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
