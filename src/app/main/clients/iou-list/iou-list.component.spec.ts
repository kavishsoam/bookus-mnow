import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IouListComponent } from './iou-list.component';

describe('IouListComponent', () => {
  let component: IouListComponent;
  let fixture: ComponentFixture<IouListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IouListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IouListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
