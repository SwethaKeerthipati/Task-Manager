import { TestBed } from '@angular/core/testing';

import { WebreqInterceptor } from './web-req.interceptor';

describe('WebreqInterceptorService', () => {
  let service: WebreqInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebreqInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
