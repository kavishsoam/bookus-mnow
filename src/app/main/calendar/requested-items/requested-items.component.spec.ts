import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedItemsComponent } from './requested-items.component';

describe('RequestedItemsComponent', () => {
  let component: RequestedItemsComponent;
  let fixture: ComponentFixture<RequestedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
