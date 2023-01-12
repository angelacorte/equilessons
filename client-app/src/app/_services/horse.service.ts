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
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(baseURL + '/horse', data, httpOptions).toPromise();
  }

  getScholasticHorses(clubId: any): Promise<Object>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/getSchoolHorses/' + clubId, httpOptions).toPromise();
  }

  getAllHorses(clubId: string): Promise<any> {
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/horses/' + clubId, httpOptions).toPromise();
  }

  getPrivateHorses(ownerId: string){
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/privateHorses/' + ownerId, httpOptions).toPromise();
  }

  getHorse(horseId: string): Promise<Object>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/horse/' + horseId, httpOptions).toPromise();
  }

  getHorseOwner(horseId: string):Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/horse/getOwner/' + horseId, {responseType: 'json'}).toPromise();
  }

  removeHorses(horseIds: string[]): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    let options = {
      httpOptions: httpOptions,
      body: horseIds
    }
    return this.http.delete(baseURL + '/removeHorses', options).toPromise();
  }

  updateHorse(horseData: HorseInfos): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(baseURL + '/updateHorse', horseData, httpOptions).toPromise();
  }
}
