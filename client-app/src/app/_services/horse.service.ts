import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {HorseInfos} from "../_utils/Horse";


const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class HorseService {

  constructor(private http: HttpClient) { }

  horseRegistration(data:any): Promise<any>{
    return this.http.post(baseURL + '/horse', data, httpOptions).toPromise();
  }

  getScholasticHorses(clubId: any): Promise<Object>{
    return this.http.get(baseURL + '/getSchoolHorses/' + clubId, httpOptions).toPromise();
  }

  getAllHorses(clubId: string): Promise<any> {
    return this.http.get(baseURL + '/horses/' + clubId, httpOptions).toPromise();
  }

  getPrivateHorses(ownerId: string){
    return this.http.get(baseURL + '/privateHorses/' + ownerId, httpOptions).toPromise();
  }

  getHorse(horseId: string): Promise<Object>{
    return this.http.get(baseURL + '/horse/' + horseId, httpOptions).toPromise();
  }

  getHorseOwner(horseId: string):Promise<any>{
    return this.http.get(baseURL + '/horse/getOwner/' + horseId, {responseType: 'json'}).toPromise();
  }

  removeHorses(horseIds: string[]): Promise<any>{
    return this.http.delete(baseURL + '/removeHorses', {body: horseIds}).toPromise();
  }

  updateHorse(horseData: HorseInfos): Promise<any>{
    return this.http.post(baseURL + '/updateHorse', horseData).toPromise();
  }
}
