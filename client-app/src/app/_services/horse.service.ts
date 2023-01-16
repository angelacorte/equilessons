import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {HorseInfos} from "../_utils/Horse";
import {TokenStorageService} from "./token-storage.service";
import { BASE_URL } from 'app/_utils/Global';


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
    return this.http.post(BASE_URL + '/horse', data, header).toPromise();
  }

  getScholasticHorses(clubId: any): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/getSchoolHorses/' + clubId, header).toPromise();
  }

  getAllHorses(clubId: string): Promise<any> {
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/horses/' + clubId, header).toPromise();
  }

  getPrivateHorses(ownerId: string){
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/privateHorses/' + ownerId, header).toPromise();
  }

  getHorse(horseId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/horse/' + horseId, header).toPromise();
  }

  getHorseOwner(horseId: string):Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
        .set('responseType', 'json')
    }
    return this.http.get(BASE_URL + '/horse/getOwner/' + horseId, header).toPromise();
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
    return this.http.delete(BASE_URL + '/removeHorses', options).toPromise();
  }

  updateHorse(horseData: HorseInfos): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(BASE_URL + '/updateHorse', horseData, header).toPromise();
  }
}
