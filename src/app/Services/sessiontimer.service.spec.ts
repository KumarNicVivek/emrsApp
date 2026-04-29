import { TestBed } from '@angular/core/testing';

import { SessiontimerService } from './sessiontimer.service';

describe('SessiontimerService', () => {
  let service: SessiontimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessiontimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
