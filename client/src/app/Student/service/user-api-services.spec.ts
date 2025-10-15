import { TestBed } from '@angular/core/testing';

import { UserApiServices } from './user-api-services';

describe('UserApiServices', () => {
  let service: UserApiServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserApiServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
