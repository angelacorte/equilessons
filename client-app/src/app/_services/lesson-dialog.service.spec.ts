import { TestBed } from '@angular/core/testing';

import { LessonDialogService } from './lesson-dialog.service';

describe('LessonDialogService', () => {
  let service: LessonDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
