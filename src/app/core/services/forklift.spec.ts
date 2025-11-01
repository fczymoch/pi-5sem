import { TestBed } from '@angular/core/testing';

import { Forklift } from './forklift';

describe('Forklift', () => {
  let service: Forklift;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Forklift);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
