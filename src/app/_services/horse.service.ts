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

  horseRegistration(data:any): Observable<any>{
    console.log("data horse reg", data);
    return this.http.post(baseURL + '/horse', data, httpOptions);
  }

  getScholasticHorses(clubId: any): Promise<Object>{
    return this.http.get(baseURL + '/getSchoolHorses/' + clubId, httpOptions).toPromise();
  }

  getAllHorses(clubId: any) {
    return this.http.get(baseURL + '/horses/' + clubId, httpOptions).toPromise();
  }

  getPrivateHorses(ownerId: string){
    return this.http.get(baseURL + '/privateHorses/' + ownerId, httpOptions).toPromise();
  }

  async getHorse(horseId: string): Promise<Object>{
    return this.http.get(baseURL + '/horse/' + horseId, httpOptions).toPromise();
  }
}
