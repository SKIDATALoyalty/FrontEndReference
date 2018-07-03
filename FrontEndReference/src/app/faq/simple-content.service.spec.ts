import { TestBed, inject } from '@angular/core/testing';

import { SimpleContentService } from './simple-content.service';

describe('SimpleContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimpleContentService]
    });
  });

  it('should be created', inject([SimpleContentService], (service: SimpleContentService) => {
    expect(service).toBeTruthy();
  }));
});
