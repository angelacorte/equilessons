import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonHistoryComponent } from './lesson-history.component';

describe('LessonHistoryComponent', () => {
  let component: LessonHistoryComponent;
  let fixture: ComponentFixture<LessonHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
