import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {HorseInfos} from "../_utils/Horse";
import {TokenStorageService} from "./token-storage.service";


const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class HorseService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  horseRegistration(data:any): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(baseURL + '/horse', data, header).toPromise();
  }

  getScholasticHorses(clubId: any): Promise<Object>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/getSchoolHorses/' + clubId, header).toPromise();
  }

  getAllHorses(clubId: string): Promise<any> {
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/horses/' + clubId, header).toPromise();
  }

  getPrivateHorses(ownerId: string){
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/privateHorses/' + ownerId, header).toPromise();
  }

  getHorse(horseId: string): Promise<Object>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/horse/' + horseId, header).toPromise();
  }

  getHorseOwner(horseId: string):Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
        .set('responseType', 'json')
    }
    return this.http.get(baseURL + '/horse/getOwner/' + horseId, header).toPromise();
  }

  removeHorses(horseIds: string[]): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    let options = {
      httpOptions: header,
      body: horseIds
    }
    return this.http.delete(baseURL + '/removeHorses', options).toPromise();
  }

  updateHorse(horseData: HorseInfos): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(baseURL + '/updateHorse', horseData, header).toPromise();
  }
}
