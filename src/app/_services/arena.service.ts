import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ArenaInfo} from "../_utils/Arena";

const baseURL = 'http://localhost:5050/arena';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ArenaService {

  constructor(private http: HttpClient) { }

  addArena(newArenas: ArenaInfo[]): Observable<any>{
    return this.http.post(baseURL, {newArenas}, httpOptions);
  }

  getClubArenas(clubId: string): Observable<any>{
    return this.http.get(baseURL + '/' + clubId, httpOptions);
  }

  removeArena(arenasId: string[]): Observable<any>{
    let options = {
      options: httpOptions,
      body: arenasId
    }
    return this.http.delete(baseURL, options);
  }
}
