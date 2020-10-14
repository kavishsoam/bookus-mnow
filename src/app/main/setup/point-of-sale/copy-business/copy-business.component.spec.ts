import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyBusinessComponent } from './copy-business.component';

describe('CopyBusinessComponent', () => {
  let component: CopyBusinessComponent;
  let fixture: ComponentFixture<CopyBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
