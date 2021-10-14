import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LessonService, LessonState} from "../_services/lesson.service"
import {DialogModifyLessonViewComponent} from "../dialog-modify-lesson-view/dialog-modify-lesson-view.component";
@Component({
  selector: 'app-dialog-lesson-view',
  templateUrl: './dialog-lesson-view.component.html',
  styleUrls: ['./dialog-lesson-view.component.css']
})
export class DialogLessonViewComponent implements OnInit {

  lesson !: LessonState;
  isClub !: any;
  userId !: any;

  constructor(
    public dialogRef: MatDialogRef<DialogLessonViewComponent>, public dialog: MatDialog, private lessonService: LessonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit(): void {

    this.lesson = this.lessonService.matchPairs(this.data.lesson);
    this.isClub = this.data.isClub;
    this.userId = this.data.userId;

    console.log("this pairs",this.lesson);

  }

  onClose():void{
    this.dialogRef.close();
  }

  onModify() {
    this.onClose();
    this.lessonService.saveLessonState(this.lesson);
    this.dialog.open(DialogModifyLessonViewComponent, {
      width: '650px',
      data: this.lesson
    });
  }
}
