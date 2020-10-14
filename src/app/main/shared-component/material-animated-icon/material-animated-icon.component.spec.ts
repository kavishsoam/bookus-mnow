import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAnimatedIconComponent } from './material-animated-icon.component';

describe('MaterialAnimatedIconComponent', () => {
  let component: MaterialAnimatedIconComponent;
  let fixture: ComponentFixture<MaterialAnimatedIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialAnimatedIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAnimatedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
