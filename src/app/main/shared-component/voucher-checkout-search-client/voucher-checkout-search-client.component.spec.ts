import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherCheckoutSearchClientComponent } from './voucher-checkout-search-client.component';

describe('VoucherCheckoutSearchClientComponent', () => {
  let component: VoucherCheckoutSearchClientComponent;
  let fixture: ComponentFixture<VoucherCheckoutSearchClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherCheckoutSearchClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherCheckoutSearchClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
