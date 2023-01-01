import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LessonService} from "../_services/lesson.service"
import {LessonState} from "../_utils/Lesson";
import {DialogModifyLessonViewComponent} from "../dialog-modify-lesson-view/dialog-modify-lesson-view.component";
import {MatSnackBar} from "@angular/material/snack-bar";
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
    public dialogRef: MatDialogRef<DialogLessonViewComponent>,private _snackBar: MatSnackBar, public dialog: MatDialog, private lessonService: LessonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit(): void {
    this.lesson = this.data.lesson;

    this.isClub = this.data.isClub;
    this.userId = this.data.userId;
  }

  onClose():void{
    this.dialogRef.close();
  }

  onModify() {
    let today = new Date();
    let lessonDay = new Date(this.lesson.beginDate);
    if(today > lessonDay){
      this._snackBar.open("Non è possibile modificare una lezione passata", "Ok", {
        duration: 5000
      });
    } else if( today <= lessonDay){
      this.onClose();
      this.dialog.open(DialogModifyLessonViewComponent, {
        width: '650px',
        data: this.lesson
      });
    }
  }
}
