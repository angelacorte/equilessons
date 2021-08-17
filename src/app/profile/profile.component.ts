import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {TokenStorageService} from "../_services/token-storage.service";

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

  roles = [];
  isLoggedIn = false;
  infos:any;
  user:any;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn){
      this.infos = this.tokenStorage.getUser();
      console.log("profile ngoninit infos", this.infos)
      this.fetchData();

    }
  }

  private fetchData() {
    this.http.get(baseURL + '/user/roles/' + this.infos.user._id, httpOptions).pipe(map(responseData=>{
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

}
