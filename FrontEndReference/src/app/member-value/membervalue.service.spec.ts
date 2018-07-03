import { TestBed, inject } from '@angular/core/testing';

import { MembervalueService } from './membervalue.service';

describe('MembervalueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MembervalueService]
    });
  });

  it('should be created', inject([MembervalueService], (service: MembervalueService) => {
    expect(service).toBeTruthy();
  }));
});
