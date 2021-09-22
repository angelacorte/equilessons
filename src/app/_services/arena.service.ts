import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const baseURL = 'http://localhost:5050/arena';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ArenaService {

  constructor(private http: HttpClient) { }

  addArena(newArenas: any[]): Observable<any>{
    return this.http.post(baseURL, {newArenas}, httpOptions);
  }

  getClubArenas(clubId: any): Observable<any>{
    return this.http.get(baseURL + '/' + clubId, httpOptions);
  }

  removeArena(arenasId: any[]): Observable<any>{
    let options = {
      options: httpOptions,
      body: arenasId
    }
    return this.http.delete(baseURL, options);
  }
}
