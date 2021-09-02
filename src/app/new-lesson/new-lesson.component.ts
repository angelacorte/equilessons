import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {HorseService} from "../_services/horse.service";
import {ArenaService} from "../_services/arena.service";
import {map} from "rxjs/operators";
import {ClubService} from "../_services/club.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.component.html',
  styleUrls: ['./new-lesson.component.css']
})
export class NewLessonComponent implements OnInit {
  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<any>;

  form:any = {
    begin: '',
    finish: '',
    clubId: '',
    arenaId: '',
    coachId: '',
    pairs: [],
    riderId: '',
    horseId: ''
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

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService,private arenaService: ArenaService, private clubService: ClubService, private horseService: HorseService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn) {
      this.infos = this.tokenStorage.getUser();
      this.form.coachId = this.infos.user['_id'];
      this.fetchData();
    }
  }

  onSubmit(): void {
    const lesson = {

    }

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
}
