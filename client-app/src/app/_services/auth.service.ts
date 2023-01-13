import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import {UserInfos} from "../_utils/Person";
import {TokenStorageService} from "./token-storage.service";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  //this sends POST requests to back-end

  login(username:string, password: string): Promise<any>{
    return this.http.post(baseURL + '/login', {
      username,
      password
    }, httpOptions).toPromise();
  }

  signup(data:UserInfos): Promise<any>{
    return this.http.post(baseURL + '/signup', data, httpOptions).toPromise();
  }

  signTemporary(data: {name: string, surname: string, telephoneNumber: number}): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(baseURL + '/addTemporary', data, header).toPromise();
  }
}
