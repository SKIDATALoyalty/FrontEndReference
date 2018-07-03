import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberValueComponent } from './member-value.component';

describe('MemberValueComponent', () => {
  let component: MemberValueComponent;
  let fixture: ComponentFixture<MemberValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
