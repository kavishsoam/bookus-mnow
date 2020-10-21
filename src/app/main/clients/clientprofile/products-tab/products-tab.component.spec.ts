import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsTabComponent } from './products-tab.component';

describe('ProductsTabComponent', () => {
  let component: ProductsTabComponent;
  let fixture: ComponentFixture<ProductsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
