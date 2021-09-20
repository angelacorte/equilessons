import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {LessonService} from "../_services/lesson.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ArenaService} from "../_services/arena.service";
import {ClubService} from "../_services/club.service";
import {HorseService} from "../_services/horse.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-add-coach',
  templateUrl: './add-coach.component.html',
  styleUrls: ['./add-coach.component.css']
})
export class AddCoachComponent implements OnInit {

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<any>;

  form:any = {
    coachId: ''
  }

  isSuccessful = false;
  errorMessage = '';
  submitted = false;
  isLoggedIn = false;
  infos: any;
  displayedColumns = ['checkbox', 'istruttore'];
  coaches: {_id: any, name: any, surname: any}[] = [];
  coachId: any;
  users = [];

  constructor(private http: HttpClient, private lessonService: LessonService, private tokenStorage: TokenStorageService, private clubService: ClubService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getUser();
      this.fetchData();
    }else{
      window.location.assign('/notAllowed');
    }
  }

  onSubmit() {
    return false;
  }

  isUserInList(id: any):boolean {
    // @ts-ignore
    return this.coaches.some(obj=>obj["_id"] === id);
  }

  addCoachToList(coachId: any) {
    this.users.forEach((value => {
      if(value['_id'] === coachId && !this.coaches.some(obj=>obj['_id'] === coachId)){
        let coach = {
          _id: value['_id'],
          name: value['name'],
          surname: value['surname']
        };
        this.coaches.push(coach);
        this.form.coachId = '';
        this.table.renderRows();
      }
    }))
  }

  private fetchData() {
    this.clubService.getClubCoaches(this.infos.club['_id']).pipe(map(responseData =>{
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
      console.log("coaches", this.coaches)
    });

    this.clubService.getClubAthletes(this.infos.club['_id']).pipe(map(responseData =>{
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
      this.users = response;
      console.log("users", this.users);
    });
  }

  isCoachUnchecked(e: any, coachId:any) {
    if(!e.target.checked){
      // @ts-ignore
      this.coaches.forEach((item,index)=>{
        if(this.coaches[index] === coachId){
          this.coaches.splice(index, 1);
          this.table.renderRows();
        }
      });
    }
  }
}
