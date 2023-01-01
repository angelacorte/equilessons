import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifyLessonViewComponent } from './dialog-modify-lesson-view.component';

describe('DialogModifyLessonViewComponent', () => {
  let component: DialogModifyLessonViewComponent;
  let fixture: ComponentFixture<DialogModifyLessonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModifyLessonViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModifyLessonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
