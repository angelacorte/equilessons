import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs";
import {Login} from "../_utils/Person";
import {TokenStorageService} from "./token-storage.service";
import { BASE_URL } from 'app/_utils/Global';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  clubLogin(data:Login):Promise<any>{
    return this.http.post(BASE_URL + '/club/login', data, httpOptions).toPromise();
  }

  registration(data:any): Promise<any>{
    return this.http.post(BASE_URL, data, httpOptions).toPromise();
  }

  getAllClubs(): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL, header).toPromise();
  }

  updateCoach(coaches:string[], clubId:string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(BASE_URL + '/updateCoach', {coaches, clubId}, header).toPromise();
  }

  getClubAthletes(clubId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/athletes/' + clubId, header).toPromise();
  }

  getClubCoaches(clubId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
        .set('responseType', 'json')
    }
    return this.http.get(BASE_URL + '/coaches/' + clubId, header).toPromise();
  }
}
