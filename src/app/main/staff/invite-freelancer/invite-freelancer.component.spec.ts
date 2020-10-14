import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFreelancerComponent } from './invite-freelancer.component';

describe('InviteFreelancerComponent', () => {
  let component: InviteFreelancerComponent;
  let fixture: ComponentFixture<InviteFreelancerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteFreelancerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteFreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
