import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {LessonService} from "../_services/lesson.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit {

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<any>;

  form:any = {
    userId:''
  };

  users:any = [];
  tmpUsers:any = [];
  isLoggedIn = false;
  infos: any;
  displayedColumns = ['checkbox', 'utente', 'numero_di_telefono'];

  constructor(private http: HttpClient, private lessonService: LessonService, private tokenStorage: TokenStorageService, private clubService: ClubService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
      this.fetchData();
    }else{
      window.location.assign('/notAllowed');
    }
  }

  private fetchData() {
    this.clubService.getClubAthletes(this.infos._id).pipe(map(responseData =>{
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;
    })).subscribe(response=>{
      response.forEach(value => {
        if(value.email === undefined){
          this.tmpUsers.push(value);
        }else{
          this.users.push(value);
        }
      })
      console.log("users", this.users);
      console.log("tmpUsers", this.tmpUsers);
    });
  }

  showInfos(userId: any) {
    console.log("TO IMPLEMENT")
  }

  isUserUnchecked(e: any, userId: any) {
    console.log("TO IMPLEMENT")
  }

  update() {
    console.log("TO IMPLEMENT")
  }
}
