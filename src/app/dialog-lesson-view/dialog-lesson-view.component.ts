import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LessonService} from "../_services/lesson.service";

export interface LessonDialogData {
  _id:any,
  beginDate: any,
  endDate: any,
  arena: any,
  coach: any,
  horses_in_lesson: any,
  riders_in_lesson: any,
  pairs: any
}

@Component({
  selector: 'app-dialog-lesson-view',
  templateUrl: './dialog-lesson-view.component.html',
  styleUrls: ['./dialog-lesson-view.component.css']
})
export class DialogLessonViewComponent implements OnInit {

  lesson!: LessonDialogData;
  pairs !: any;
  isClub !: any;
  userId !: any;

  constructor(
    public dialogRef: MatDialogRef<DialogLessonViewComponent>, private lessonService: LessonService,
    @Inject(MAT_DIALOG_DATA) public data: LessonDialogData) {}

  ngOnInit(): void {
    // @ts-ignore
    this.lesson = this.lessonService.matchPairs(this.data.lesson);
    // @ts-ignore
    this.isClub = this.data.isClub;
    // @ts-ignore
    this.userId = this.data.userId;

    console.log("this pairs",this.lesson);

  }

  onClose():void{
    this.dialogRef.close();
  }

}
