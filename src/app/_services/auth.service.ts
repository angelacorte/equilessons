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
    return this.http.post(baseURL + '/login', {
      username,
      password
    }, httpOptions);
  }

  signup(name:string, surname:string, email:string, birthday:string, username:string, password:string, phoneNumber:number, taxcode:string,
         city:string, address:string, nrFise:string, clubId:string, isOwner:boolean): Observable<any>{
    let roles = [];

    if(isOwner){
      roles.push("horse-owner");
    }else{
      roles.push("pupil");
    }
    return this.http.post(baseURL + '/signup', {
      name,
      surname,
      email,
      birthday,
      username,
      password,
      phoneNumber,
      taxcode,
      city,
      address,
      nrFise,
      clubId,
      isOwner,
      roles
    }, httpOptions);
  }
}
