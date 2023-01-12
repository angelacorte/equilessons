import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs";
import {Login} from "../_utils/Person";
import {TokenStorageService} from "./token-storage.service";

const baseURL = 'http://localhost:5050/club';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  clubLogin(data:Login):Promise<any>{
    return this.http.post(baseURL + '/login', data, httpOptions).toPromise();
  }

  registration(data:any): Promise<any>{
    return this.http.post(baseURL, data, httpOptions).toPromise();
  }

  getAllClubs(): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL, httpOptions).toPromise();
  }

  updateCoach(coaches:string[], clubId:string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(baseURL + '/updateCoach', {coaches, clubId}, httpOptions).toPromise();
  }

  getClubAthletes(clubId: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/athletes/' + clubId, httpOptions).toPromise();
  }

  getClubCoaches(clubId: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/coaches/' + clubId, {responseType: 'json'}).toPromise();
  }
}
