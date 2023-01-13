import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLessonViewComponent } from 'app/dialog-lesson-view/dialog-lesson-view.component';
import { LessonState } from 'app/_utils/Lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonDialogService {

  constructor(public dialog: MatDialog) { }
  
  showLessonInfo(lesson: LessonState, isClub: boolean, userId: string, isCoach: boolean) {
    let data = {
      lesson: lesson,
      isClub: isClub,
      userId: userId,
      isCoach: isCoach
    };
    this.dialog.open(DialogLessonViewComponent, {
      width: '650px',
      data: data
    });
  }
}
