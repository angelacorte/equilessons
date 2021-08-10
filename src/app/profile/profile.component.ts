import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.fetchData();
  }

/*  private fetchData() {
    this.http.get(baseURL + '/user/roles', httpOptions).pipe(map(responseData=>{
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
      this.roles = response;
    });
  }*/

}
