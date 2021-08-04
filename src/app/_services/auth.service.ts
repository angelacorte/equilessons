import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //this sends POST requests to back-end

  login(username:string, password: string): Observable<any>{
    console.log("auth service login ");
    return this.http.post(baseURL + '/login', {
      username,
      password
    }, httpOptions);
  }

  signup(name: string, surname: string, taxcode: string, email: string, telephone: number, birthday: string, birthLocation: string,
         nationality: string, username: string, password: string, city: string, cap: number, address: string, county: string, nrFise: string, club: string, owner: boolean): Observable<any>{
    return this.http.post(baseURL + '/signup', {
      name, surname, taxcode, email, telephone, birthday, birthLocation, nationality, username, password, city, cap, address, county, nrFise, club, owner
    }, httpOptions);
  }
}
