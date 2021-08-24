import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from "rxjs/operators";
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

  registration(data:any): Observable<any>{ //id:any (owner's id)  /$(id)
    return this.http.post(baseURL, data, httpOptions);
  }

  getAllClubs(): Observable<any>{
    return this.http.get(baseURL, httpOptions);
  }
}
