import { TestBed, inject } from '@angular/core/testing';

import { OrderCheckoutService } from './order-checkout.service';

describe('OrderCheckoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderCheckoutService]
    });
  });

  it('should be created', inject([OrderCheckoutService], (service: OrderCheckoutService) => {
    expect(service).toBeTruthy();
  }));
});
