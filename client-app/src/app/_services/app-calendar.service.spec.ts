import { TestBed } from '@angular/core/testing';

import { AppCalendarService } from './app-calendar.service';

describe('AppCalendarService', () => {
  let service: AppCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
