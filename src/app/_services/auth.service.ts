import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserInfos} from "../_utils/Person";

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
    return this.http.post(baseURL + '/login', {
      username,
      password
    }, httpOptions);
  }

  signup(data:UserInfos): Observable<any>{
    return this.http.post(baseURL + '/signup', data, httpOptions);
  }

  signTemporary(data: {name: string, surname: string, telephoneNumber: number}): Observable<any>{
    return this.http.post(baseURL + '/addTemporary', data, httpOptions);
  }
}
