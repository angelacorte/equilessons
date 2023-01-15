import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ArenaInfo} from "../_utils/Arena";
import {TokenStorageService} from "./token-storage.service";
import {BASE_URL} from '../_utils/Global'

let httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ArenaService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }


  addArena(newArenas: ArenaInfo): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(BASE_URL, {newArenas}, header).toPromise();
  }

  getClubArenas(clubId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/' + clubId, header).toPromise();
  }

  removeArena(arenasId: string[]): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    let options = {
      httpOptions: header,
      body: arenasId
    }
    return this.http.delete(BASE_URL, options).toPromise();
  }
}
