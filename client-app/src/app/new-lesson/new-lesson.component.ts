import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {HorseService} from "../_services/horse.service";
import {ArenaService} from "../_services/arena.service";
import {ClubService} from "../_services/club.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {LessonService} from "../_services/lesson.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClubInfos, Coach, UserInfos} from "../_utils/Person";
import {HorseInfos} from "../_utils/Horse";
import {NotificationService} from '../_services/notification.service';
import {Notification, NotificationType} from '../_utils/Notification';
import {LessonState} from '../_utils/Lesson';
import {ArenaInfo} from "../_utils/Arena";
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";

@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.component.html',
  styleUrls: ['./new-lesson.component.css']
})
export class NewLessonComponent implements OnInit {


  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort, {static:false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;

  form:any = {
    lessonDate: '',
    lessonHour: '',
    lessonDuration: '',
    clubId: '',
    arenaId: '',
    coachId: '',
    pairs: [],
    riderId: '',
    horseId: '',
    //color: ''
  }

  lesson: {riderInfo: any, horseInfo: any}[] = []; //{riderId: any, horseId: any}[]
  dataSource = new MatTableDataSource(this.lesson);
  riders = [];
  isSuccessful = false;
  isLoggedIn = false;
  infos!: ClubInfos | UserInfos;
  arenas: ArenaInfo[] = [];
  horses: HorseInfos[] = [];
  displayedColumns = ['checkbox', 'allievo', 'cavallo'];
  coaches: Coach[] = [];
  coachId: string = '';
  isClub: boolean = false;
  checked: boolean = true;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private lessonService: LessonService, private tokenStorage: TokenStorageService,private arenaService: ArenaService, private clubService: ClubService, private horseService: HorseService, private notificationService: NotificationService) { }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    this.isClub = this.tokenStorage.isClub();

    if(this.isLoggedIn) {
      this.infos = this.tokenStorage.getInfos(this.isClub); //get the infos saved in the session
      if(this.isClub && this.infos) {
        this.form.clubId = this.infos['_id'];
      }else{
        // @ts-ignore
        this.form.clubId = this.infos['clubId'];
      }

      if (this.isClub || this.tokenStorage.isCoach(this.infos)) { //check on user's login
        this.coaches = await this.getClubCoaches(this.form.clubId);
        this.arenas = await this.getClubArenas(this.form.clubId);
        this.riders = await this.getClubAthletes(this.form.clubId);
        this.horses = await this.getScholasticHorses(this.form.clubId);
      //   this.coaches =
      } else {
        window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
      }
    }else {
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  async onSubmit(): Promise<void> {
    let beginDate = new Date(this.form.lessonDate);
    beginDate.setHours(this.form.lessonHour.substring(0,2), this.form.lessonHour.substring(3,5));
    let endDate = new Date(beginDate.getTime() + this.form.lessonDuration*60000);
    let pairs: { riderId: any; horseId: any; }[] = [];

    this.lesson.forEach((val: any) =>{
      let pair = {
        riderId: val.riderInfo['riderId'],
        horseId: val.horseInfo['horseId']
      }
      pairs.push(pair);
    })

    const lesson = {
      beginDate: beginDate,
      endDate: endDate,
      arenaId: this.form.arenaId,
      coachId: this.coachId,
      clubId: this.form.clubId,
      pairs: pairs,
      notes: this.form.notes
    }

    try {
      let d: LessonState = await this.lessonService.createLesson(lesson).then(res =>{
        if(res.status == 200){
          this.openSnackbar(SnackBarMessages.SUCCESS, SnackBarActions.ASSIGN)
          return res.lesson
        }else{
          this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RETRY)
        }
      })
      const notification = Notification(
        this.tokenStorage.getInfos(this.isClub)._id,
        pairs.pop()?.riderId,
        NotificationType.ADD,
        new Date(),
        d.lessonId,
        d.beginDate,
        d.notes
      )
      await this.notificationService.createNotification(notification)
    } catch(err){
      this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RETRY)
    }
  }

  private async getClubArenas(id:string):Promise<any>{
    return await this.arenaService.getClubArenas(id).then(res => {
      if(res.status == 200){
        return res.arenas
      }
    });
  }

  private async getClubAthletes(id:any):Promise<any>{
    return this.clubService.getClubAthletes(id);
  }

  private async getScholasticHorses(id:any):Promise<any>{
    return await this.horseService.getScholasticHorses(id);
  }

  private async getClubCoaches(id:string): Promise<Coach[]>{ //remove user's id from coaches list if id is not referred to club
    return this.clubService.getClubCoaches(id).then(res =>{
      if(res.status == 200){
        res.coaches.forEach((c: Coach) => {
          this.coaches.push(c)
        })
        if(!this.isClub){
          res.coaches = res.coaches.filter((coach: Coach) => coach._id !== this.infos._id);
        }
        return res.coaches
      }
    })

  }

  addRiderToList(riderId: any, horseId: any) {
    this.riders.forEach((value => {
      if(value['_id'] === riderId && !this.lesson.some((obj: any)=>obj['riderId'] === riderId)){
        let rider = {
          riderId: value['_id'],
          name: value['name'],
          surname: value['surname']
        }
        this.horses.forEach(((val: any) =>{
          if(val['_id'] === horseId  && !this.lesson.some((obj: any)=>obj['horseId'] === horseId)){
            let horse = {
              horseId: val['_id'],
              horseName: val['horseName']
            }
            let pair = {
              riderInfo: rider,
              horseInfo: horse
            }
            this.lesson.push(pair);
            this.form.horseId = '';
            this.form.riderId = '';
            this.dataSource = new MatTableDataSource(this.lesson);
            this.dataSource.data = this.lesson;
            this.dataSource.sort;
            this.dataSource.paginator = this.paginator;
            this.dataSource.data = this.lesson;
          }
        }))
      }
    }))
  }

  isRiderUnchecked(pair: any) {
    this.lesson.forEach((item: any, index: number)=>{
      if(this.lesson[index] === pair){
        this.lesson.splice(index, 1);
        this.dataSource.data = this.lesson;
      }
    });
  }

  checkCoach() {
    this.checked = !this.checked;
  }

  isRiderInList(id: any): boolean {
    return this.lesson.some((obj)=>obj.riderInfo["riderId"] === id);

  }

  isRider(rider: any) {
    this.riders.some((obj: any)=>{
      if(obj._id === rider){
        this.form.riderId = rider;
        this.lesson.some((o)=> {
          if (o.horseInfo['horseId'] !== obj.horse[0] && obj.horse.length > 0) {
            this.form.horseId = obj.horse[0];
          }
        })
      }
    });
  }

  onReset() {
    this.form.lessonDuration = '';
    this.form.arenaId = '';
    this.form.lessonDate = '';
    this.form.lessonHour = '';
    this.lesson = [];
  }

  private openSnackbar(message:string, option: SnackBarActions){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      switch (option) {
        case SnackBarActions.ASSIGN:
          window.location.assign("/home")
          break;
        case SnackBarActions.RELOAD:
          window.location.reload();
          break;
        case SnackBarActions.RETRY:
          break;
      }
    })
  }
}
