import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedFreelancersComponent } from './applied-freelancers.component';

describe('AppliedFreelancersComponent', () => {
  let component: AppliedFreelancersComponent;
  let fixture: ComponentFixture<AppliedFreelancersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppliedFreelancersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppliedFreelancersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
