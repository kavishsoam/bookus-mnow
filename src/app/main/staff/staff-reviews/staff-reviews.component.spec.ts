import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffReviewsComponent } from './staff-reviews.component';

describe('StaffReviewsComponent', () => {
  let component: StaffReviewsComponent;
  let fixture: ComponentFixture<StaffReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
