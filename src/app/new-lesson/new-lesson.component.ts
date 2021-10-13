import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {HorseService} from "../_services/horse.service";
import {ArenaService} from "../_services/arena.service";
import {map} from "rxjs/operators";
import {ClubService} from "../_services/club.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {validateEvents} from "angular-calendar/modules/common/util";
import {LessonService, LessonState} from "../_services/lesson.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ActivatedRoute} from "@angular/router";
import {DialogLessonViewComponent} from "../dialog-lesson-view/dialog-lesson-view.component";

@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.component.html',
  styleUrls: ['./new-lesson.component.css']
})
export class NewLessonComponent implements OnInit {


  @ViewChild(MatTable, {static:false}) table!: MatTable<any>;
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

  updateLesson !: LessonState;
  dataSource:any;
  isSuccessful = false;
  isRegistrationFailed = false;
  errorMessage = '';
  submitted = false;
  isLoggedIn = false;
  infos: any;
  riders = [];
  arenas = [];
  lesson: any = []; //{riderId: any, horseId: any}[]
  horses: any;
  displayedColumns = ['checkbox', 'allievo', 'cavallo'];
  coaches: {_id: any, name: any, surname: any}[] = [];
  coachId: any;
  isClub: boolean = false;

  constructor(private http: HttpClient, private lessonService: LessonService, private tokenStorage: TokenStorageService,private arenaService: ArenaService, private clubService: ClubService, private horseService: HorseService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    this.isClub = this.tokenStorage.isClub();

    if(this.isLoggedIn && this.isClub) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
      if(this.lessonService.getLessonState()){ //means that a lesson has been passed to modify it
        this.modifyLesson();
      }
      this.fetchData();
    }else{
      window.location.assign('/notAllowed');
    }
  }

  private modifyLesson(){

    this.updateLesson = this.lessonService.getLessonState();
    console.log("this.updateLesson.beginDate", this.updateLesson.beginDate);
    console.log("begin date to string", this.updateLesson.beginDate.toString());
    let lessonDate = new Date(this.updateLesson.beginDate);
    console.log("lessondate", lessonDate);
    this.form.lessonDate = lessonDate.getFullYear() + '-' + (lessonDate.getMonth()+1) +'-'+ lessonDate.getDate();
    this.form.lessonHour = lessonDate.getHours() +':'+ (lessonDate.getMinutes() < 10 ? '0' + lessonDate.getMinutes().toString() : lessonDate.getMinutes());

    console.log("getLessonState()",this.lessonService.getLessonState())
    console.log("this.form", this.form);
  }

  onSubmit(): void {
    let beginDate = new Date(this.form.lessonDate.toString() + ' ' + this.form.lessonHour.toString());
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
      clubId: this.infos['_id'],
      pairs: pairs,
      //color: this.form.color
    }

    /*this.lessonService.createLesson(lesson).subscribe(response=>{
      this.submitted = true;
      this.isSuccessful = true;
    }, err => {
      this.errorMessage = err.error.message;
      this.isRegistrationFailed = true;
      console.log(err);
    })*/
  }

  private fetchData() {
    this.arenaService.getClubArenas(this.infos['_id']).pipe(map(responseData =>{
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;
    })).subscribe(response=>{
      // @ts-ignore
      this.arenas = response;
    });

    this.clubService.getClubAthletes(this.infos['_id']).pipe(map(responseData =>{
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;
    })).subscribe(response=>{
      // @ts-ignore
      this.riders = response;
      console.log("this.riders", this.riders)
    });

    this.horseService.getScholasticHorses(this.infos['_id']).pipe(map(responseData =>{
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;
    })).subscribe(response=>{
      // @ts-ignore
      this.horses = response;
      console.log("this.horses", this.horses)
    });

    this.clubService.getClubCoaches(this.infos['_id']).pipe(map(responseData =>{
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;
    })).subscribe(response=>{
      // @ts-ignore
      this.coaches = response[0].clubCoaches;
      if(!this.isClub){
        this.coaches.forEach((item,index)=>{
          if(item['_id'] === this.infos['_id']){
            this.coaches.splice(index, 1);
          }
        });
      }
      console.log("this.coaches", this.coaches)
    });
  }

  addRiderToList(riderId: any, horseId: any) {
    this.riders.forEach((value => {
      // @ts-ignore
      if(value['_id'] === riderId && !this.lesson.some(obj=>obj['riderId'] === riderId)){
        let rider = {
          riderId: value['_id'],
          name: value['name'],
          surname: value['surname']
        }
        // @ts-ignore
        this.horses.forEach((val =>{
          // @ts-ignore
          if(val['_id'] === horseId  && !this.lesson.some(obj=>obj['horseId'] === horseId)){
            let horse = {
              horseId: val['_id'],
              horseName: val['horseName']
            }
            let pair = {
              riderInfo: rider,
              horseInfo: horse
            }
            // @ts-ignore
            this.lesson.push(pair);
            this.form.horseId = '';
            this.form.riderId = '';
            this.dataSource = new MatTableDataSource(this.lesson);
            this.dataSource.data = this.lesson;
            this.dataSource.sort;
            this.dataSource.paginator = this.paginator;
            this.table.renderRows();
          }
        }))
      }
    }))
  }

  isRiderUnchecked(e: any, pair: any) {
    if(!e.target.checked){
      // @ts-ignore
      this.lesson.forEach((item,index)=>{
        if(this.lesson[index] === pair){
          this.lesson.splice(index, 1);
          this.table.renderRows();
        }
      });
    }
  }

  isCoach(e: any) {
    if(e.target.checked){
      this.form.coachId = this.infos['_id'];
    }else{
      this.form.coachId = this.coachId;
    }
  }

  isRiderInList(id: any): boolean {
    // @ts-ignore
    return this.lesson.some(obj=>obj.riderInfo["riderId"] === id);

  }

  isHorseInList(id: any) {
    // @ts-ignore
    return this.lesson.some(obj=>obj.horseInfo["horseId"] === id)
  }

  isRider(rider: any) {
    this.riders.some(obj=>{
      // @ts-ignore
      if(obj._id === rider){
        this.form.riderId = rider;
        // @ts-ignore
        this.lesson.some(o=> {
          // @ts-ignore
          if (o.horseInfo['horseId'] !== obj.horse[0] && obj.horse.length > 0) {
            // @ts-ignore
            this.form.horseId = obj.horse[0];
          }
        })
      }
    })
  }

  onReset() {
    this.form.lessonDuration = '';
    this.form.arenaId = '';
    this.form.lessonDate = '';
    this.form.lessonHour = '';
    this.lesson = [];
  }
}
