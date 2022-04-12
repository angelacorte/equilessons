import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {ClubService} from "../_services/club.service";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  roles: string[] = [];
  isLoggedIn = false;
  infos:any;
  user:any;
  isClub: boolean = false;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private userService: UserService, private clubService: ClubService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn){
      this.isClub = this.tokenStorage.isClub();
      this.infos = this.tokenStorage.getInfos(this.isClub);

      if(!this.isClub) this.fetchData();

      //this.updateInfos();
    }else{
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  private fetchData() {
    this.userService.getUserRoles(this.infos._id).pipe(map(responseData=>{
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          if(key == 'roles'){
            // @ts-ignore
            dataArray.push(responseData[key])
          }
        }
      }
      return dataArray;
    })).subscribe(response=>{
      this.roles = response[0];
    });
  }

  /*private updateInfos(){
    //console.log("clubid before", this.infos.user['clubId']);
    this.infos = this.tokenStorage.getUser();
    //this.infos.user['clubId'] = this.infos.clubId;
    console.log("clubid updateinfos after tokenstorage get user", this.infos.user['clubId']);
  }*/

}
