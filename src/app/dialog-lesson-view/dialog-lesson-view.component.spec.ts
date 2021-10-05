import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLessonViewComponent } from './dialog-lesson-view.component';

describe('DialogLessonViewComponent', () => {
  let component: DialogLessonViewComponent;
  let fixture: ComponentFixture<DialogLessonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLessonViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLessonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
