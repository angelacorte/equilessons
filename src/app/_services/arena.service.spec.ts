import { TestBed } from '@angular/core/testing';

import { ArenaService } from './arena.service';

describe('ArenaService', () => {
  let service: ArenaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArenaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
