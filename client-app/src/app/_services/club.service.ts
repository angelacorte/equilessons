import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs";

const baseURL = 'http://localhost:5050/club';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  clubLogin(data:any):Observable<any>{
    return this.http.post(baseURL + '/login', data, httpOptions);
  }

  registration(data:any): Observable<any>{ //id:any (owner's id)  /$(id)
    return this.http.post(baseURL, data, httpOptions);
  }

  getAllClubs(): Observable<any>{
    return this.http.get(baseURL, httpOptions);
  }

  addCoach(coaches:string[], clubId:any): Observable<any>{
    return this.http.post(baseURL + '/addCoach', {coaches, clubId}, httpOptions);
  }

  getClubAthletes(clubId: string): Promise<any>{
    return this.http.get(baseURL + '/athletes/' + clubId, httpOptions).toPromise();
  }

  getClubCoaches(clubId: string): Promise<any>{
    return this.http.get(baseURL + '/coaches/' + clubId, {responseType: 'json'}).toPromise();
  }
}
