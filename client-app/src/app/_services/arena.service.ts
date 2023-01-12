import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ArenaInfo} from "../_utils/Arena";
import {TokenStorageService} from "./token-storage.service";

const baseURL = 'http://localhost:5050/arena';

let httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ArenaService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }


  addArena(newArenas: ArenaInfo): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(baseURL, {newArenas}, httpOptions).toPromise();
  }

  getClubArenas(clubId: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/' + clubId, httpOptions).toPromise();
  }

  removeArena(arenasId: string[]): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    let options = {
      options: httpOptions,
      body: arenasId
    }
    return this.http.delete(baseURL, options).toPromise();
  }
}
