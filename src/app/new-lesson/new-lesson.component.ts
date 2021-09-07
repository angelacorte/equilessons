import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {HorseService} from "../_services/horse.service";
import {ArenaService} from "../_services/arena.service";
import {map} from "rxjs/operators";
import {ClubService} from "../_services/club.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {validateEvents} from "angular-calendar/modules/common/util";
import {LessonService} from "../_services/lesson.service";

@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.component.html',
  styleUrls: ['./new-lesson.component.css']
})
export class NewLessonComponent implements OnInit {
  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<any>;

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
  //riderId: any;
  //horseId: any;
  displayedColumns = ['checkbox', 'allievo', 'cavallo'];
  coaches: {_id: any, name: any, surname: any}[] = [];
  coachId: any;

  constructor(private http: HttpClient, private lessonService: LessonService, private tokenStorage: TokenStorageService,private arenaService: ArenaService, private clubService: ClubService, private horseService: HorseService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn) {
      this.infos = this.tokenStorage.getUser();
      this.form.coachId = this.infos.user['_id'];
      this.fetchData();
    }
  }

  onSubmit(): void {
    let beginDate = new Date(this.form.lessonDate.toString() + ' ' + this.form.lessonHour.toString());
    let endDate = new Date(beginDate.getTime() + this.form.lessonDuration*60000);
    let pairs: { riderId: any; horseId: any; }[] = [];
    console.log("newdate", beginDate);
    console.log("tmp", endDate)

    this.lesson.forEach((val: any) =>{
      console.log("lesson foreach val", val);
      let pair = {
        riderId: val.riderInfo['riderId'],
        horseId: val.horseInfo['horseId']
      }
      console.log("pair", pair)
      pairs.push(pair);
    })
    console.log("pairs", pairs)

    const lesson = {
      beginDate: beginDate,
      endDate: endDate,
      arenaId: this.form.arenaId,
      coachId: this.form.coachId,
      clubId: this.infos.user['clubId'],
      pairs: pairs,
      //color: this.form.color
    }
    console.log("lesson", lesson);

    this.lessonService.createLesson(lesson).subscribe(response=>{
      this.submitted = true;
      this.isSuccessful = true;
    }, err => {
      this.errorMessage = err.error.message;
      this.isRegistrationFailed = true;
      console.log(err);
    })
  }

  private fetchData() {
    this.arenaService.getClubArenas(this.infos.user['clubId']).pipe(map(responseData =>{
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

    this.clubService.getClubAthletes(this.infos.user['clubId']).pipe(map(responseData =>{
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
    });

    this.horseService.getScholasticHorses(this.infos.user['clubId']).pipe(map(responseData =>{
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
    });

    this.clubService.getClubCoaches(this.infos.user['clubId']).pipe(map(responseData =>{
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
      this.coaches = response;
      this.coaches.forEach((item,index)=>{
        if(item['_id'] === this.infos.user['_id']){
          this.coaches.splice(index, 1);
        }
      });
    });
  }

  addRiderToList(riderId: any, horseId: any) {
    console.log("click 1")
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
      this.form.coachId = this.infos.user['_id'];
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
