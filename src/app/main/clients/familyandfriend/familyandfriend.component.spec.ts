import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyandfriendComponent } from './familyandfriend.component';

describe('FamilyandfriendComponent', () => {
  let component: FamilyandfriendComponent;
  let fixture: ComponentFixture<FamilyandfriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyandfriendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyandfriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
