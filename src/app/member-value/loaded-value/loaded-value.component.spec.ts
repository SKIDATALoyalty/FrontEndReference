import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadedValueComponent } from './loaded-value.component';

describe('LoadedValueComponent', () => {
  let component: LoadedValueComponent;
  let fixture: ComponentFixture<LoadedValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadedValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadedValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
