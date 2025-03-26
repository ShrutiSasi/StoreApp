/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CartsService } from './carts.service';

describe('Service: Carts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartsService]
    });
  });

  it('should ...', inject([CartsService], (service: CartsService) => {
    expect(service).toBeTruthy();
  }));
});
