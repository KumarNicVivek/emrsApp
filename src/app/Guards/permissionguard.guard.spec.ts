import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { permissionguardGuard } from './permissionguard.guard';

describe('permissionguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => permissionguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
