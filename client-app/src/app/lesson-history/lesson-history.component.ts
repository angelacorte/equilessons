import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {LessonState} from "../_utils/Lesson";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubInfos, UserInfos} from "../_utils/Person";
import {LessonService} from "../_services/lesson.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {DialogLessonViewComponent} from "../dialog-lesson-view/dialog-lesson-view.component";
import {MatDialog} from "@angular/material/dialog";
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";
import {HorseInfos} from "../_utils/Horse";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-lesson-history',
  templateUrl: './lesson-history.component.html',
  styleUrls: ['./lesson-history.component.css']
})
export class LessonHistoryComponent implements OnInit {
  @ViewChild(MatTable, {static:false}) table!: MatTable<any>;
  @ViewChild(MatSort, {static:false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;

  lessons!: LessonState[]
  dataSource = new MatTableDataSource(this.lessons)
  isLoggedIn:boolean = false;
  isClub: boolean = false;
  isCoach: boolean = false;
  infos!: ClubInfos | UserInfos;
  displayedColumns = ['data', 'ora', 'campo', 'istruttore']
  constructor(private _snackBar: MatSnackBar, private tokenStorage: TokenStorageService, public dialog: MatDialog, private lessonService: LessonService) { }

  async ngOnInit() {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {
      this.isClub = this.tokenStorage.isClub();
      if (!this.isClub) this.isCoach = this.tokenStorage.isCoach()
      this.infos = this.tokenStorage.getInfos(this.isClub); //get the infos saved in the session
      if (this.isClub) this.lessons = await this.getLessons(this.infos._id)
      else if(this.isCoach) {
        this.lessons = await this.getCoachLessons(this.infos._id)
        this.displayedColumns = ['data', 'ora', 'campo']
      } else this.lessons = await this.getUserLessons(this.infos._id)
      this.setDataSource(this.lessons)
    } else {
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  private async getLessons(clubId: string): Promise<any>{
    return await this.lessonService.getLessonsByClubId(clubId).then(r => {
      if(r.status == 200){
        return r.lessons
      }else{
        this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RELOAD)
      }
    });
  }
  private async getCoachLessons(coachId: string): Promise<any>{
    return await this.lessonService.getCoachLesson(coachId).then(r => {
      if(r.status == 200){
        return  r.lessons
      }else{
        this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RELOAD)
      }
    })
  }
  private async getUserLessons(userId: string) {
    return await this.lessonService.getUserLessons(userId).then(r => {
      if(r.status == 200){
        return r.lessons
      }else{
        this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RELOAD)
      }
    })
  }

  private setDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort
    this.dataSource.paginator = this.paginator;
  }

  showLessonInfos(l: LessonState) {
    let data = {
      lesson: l,
      isClub: this.isClub,
      userId: this.infos['_id'],
      isCoach: this.isCoach
    };
    this.dialog.open(DialogLessonViewComponent, {
      width: '650px',
      data: data
    });
  }

  private openSnackbar(message: string, option: SnackBarActions, data?: HorseInfos) {
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=> {
      switch (option) {
        case SnackBarActions.RELOAD || SnackBarActions.RETRY:
          window.location.reload();
      }
    })
  }
}
