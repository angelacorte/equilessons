import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {LessonState} from "../_utils/Lesson";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubInfos, UserInfos} from "../_utils/Person";
import {LessonService} from "../_services/lesson.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

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
  constructor(private tokenStorage: TokenStorageService, private lessonService: LessonService) { }

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
        console.log("r ", r)
        return r.lessons
      }else{
        //todo
      }
    });
  }
  private async getCoachLessons(coachId: string): Promise<any>{
    return await this.lessonService.getCoachLesson(coachId).then(r => {
      if(r.status == 200){
        return  r.lessons
      }else{
        //todo
      }
    })
  }
  private async getUserLessons(userId: string) {
    return await this.lessonService.getUserLessons(userId).then(r => {
      if(r.status == 200){
        console.log("r ", r)
        return r.lessons
      }else{
        //todo
      }
    })
  }

  private setDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort
    this.dataSource.paginator = this.paginator;
  }
}
