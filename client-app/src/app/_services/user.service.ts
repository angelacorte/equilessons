import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
// import { User } from '../_models/user.model';

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  //This provides methods to access public and protected resources

  addRole(role:any, id:string): Promise<any>{ //todo add "coach" to user when adding a coach by club
    return this.http.post(baseURL + '/user/roles', {role, id}).toPromise();
  }

  getUserRoles(id:string): Promise<any>{
    return this.http.get(baseURL + '/user/roles/' + id).toPromise();
  }

  removeUser(data:any): Promise<any>{
    let options = {
      options: httpOptions,
      body: data
    }
    return this.http.delete(baseURL + '/user', options).toPromise();
  }

  changeClub(userId:any, clubId:any): Promise<any>{
    return this.http.post(baseURL + '/user/changeClub', {userId, clubId}).toPromise();
  }

  getUserById(userId:string): Promise<any>{
    return this.http.get(baseURL + '/userinfo/' + userId, httpOptions).toPromise();
  }

  getUserHorses(userId:string): Promise<any>{
    return this.http.get(baseURL + '/userhorse/' + userId, httpOptions).toPromise();
  }
}
