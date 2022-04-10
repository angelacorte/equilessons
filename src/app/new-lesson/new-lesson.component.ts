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
import {MatSnackBar} from "@angular/material/snack-bar";

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

  dataSource:any;
  isSuccessful = false;
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

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private lessonService: LessonService, private tokenStorage: TokenStorageService,private arenaService: ArenaService, private clubService: ClubService, private horseService: HorseService, private changeDetectorRefs: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    this.isClub = this.tokenStorage.isClub();

    if(this.isLoggedIn) {
      this.infos = this.tokenStorage.getInfos(this.isClub); //get the infos saved in the session
      if(this.isClub) {
        this.form.clubId = this.infos['_id']
      }else{
        this.form.clubId = this.infos['clubId'];
      }

      if (this.isClub || this.tokenStorage.isCoach(this.infos)) { //check on user's login
        this.arenas = await this.getClubArenas(this.form.clubId);
        this.riders = await this.getClubAthletes(this.form.clubId);
        this.horses = await this.getScholasticHorses(this.form.clubId);
        this.coaches = await this.getClubCoaches(this.form.clubId);
      } else {
        window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
      }
    }else {
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  onSubmit(): void {
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
    }

    this.lessonService.createLesson(lesson).subscribe(response=>{
      if(response.errors != undefined){
        this._snackBar.open("Riempi i campi obbligatori.", "Ok", {
          duration: 3000
        });
      }else{
        let snackBarRef = this._snackBar.open("Lezione creata con successo", "Ok", {
          duration: 3000
        });
        snackBarRef.afterDismissed().subscribe(()=>{
          window.location.assign('/calendar');
        })
      }
    }, err => {
      this._snackBar.open("Non è stato possibile creare la lezione", "Ok", {
        duration: 3000
      });
      console.log(err);
    })
  }

  private async getClubArenas(id:any):Promise<any>{
    return await this.arenaService.getClubArenas(id).toPromise();
  }

  private async getClubAthletes(id:any):Promise<any>{
    return await this.clubService.getClubAthletes(id).toPromise();
  }

  private async getScholasticHorses(id:any):Promise<any>{
    return await this.horseService.getScholasticHorses(id).toPromise();
  }

  private async getClubCoaches(id:any):Promise<any>{ //remove user's id from coaches list if id is not referred to club
    let coaches = await this.clubService.getClubCoaches(id).toPromise();
    coaches.forEach((item:any,index:any)=>{
      if(item['_id'] === this.infos['_id']){
        this.coaches.splice(index, 1);
      }
    });
    return coaches[0].clubCoaches;
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

  checkCoach(e: any) {
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
