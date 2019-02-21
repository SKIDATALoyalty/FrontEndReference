import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredValueComponent } from './stored-value.component';

describe('StoredValueComponent', () => {
  let component: StoredValueComponent;
  let fixture: ComponentFixture<StoredValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
