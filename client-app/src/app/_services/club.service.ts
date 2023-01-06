import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs";
import {Login} from "../_utils/Person";

const baseURL = 'http://localhost:5050/club';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  clubLogin(data:Login):Promise<any>{
    return this.http.post(baseURL + '/login', data, httpOptions).toPromise();
  }

  registration(data:any): Promise<any>{ //id:any (owner's id)  /$(id)
    return this.http.post(baseURL, data, httpOptions).toPromise();
  }

  getAllClubs(): Promise<any>{
    return this.http.get(baseURL, httpOptions).toPromise();
  }

  updateCoach(coaches:string[], clubId:string): Promise<any>{
    return this.http.post(baseURL + '/updateCoach', {coaches, clubId}, httpOptions).toPromise();
  }

  getClubAthletes(clubId: string): Promise<any>{
    return this.http.get(baseURL + '/athletes/' + clubId, httpOptions).toPromise();
  }

  getClubCoaches(clubId: string): Promise<any>{
    return this.http.get(baseURL + '/coaches/' + clubId, {responseType: 'json'}).toPromise();
  }
}
