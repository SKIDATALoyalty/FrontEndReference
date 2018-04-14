import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointActivityComponent } from './point-activity.component';

describe('PointActivityComponent', () => {
  let component: PointActivityComponent;
  let fixture: ComponentFixture<PointActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
