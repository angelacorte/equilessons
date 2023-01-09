import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Roles, UserInfos} from "../_utils/Person";
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

  addRole(role:Roles, id:string): Promise<any>{
    return this.http.post(baseURL + '/user/roles', {role, id}).toPromise();
  }
  removeRole(role: Roles, id: string): Promise<any>{
    let options = {
      options: httpOptions,
      body: {role, id}
    }
    return this.http.delete(baseURL + '/user/removeRole', options).toPromise();
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

  updateUser(data: UserInfos): Promise<any>{
    return this.http.post(baseURL + '/user/updateUser', data).toPromise();
  }

  getUserById(userId:string): Promise<any>{
    return this.http.get(baseURL + '/userinfo/' + userId, httpOptions).toPromise();
  }

  getUserHorses(userId:string): Promise<any>{
    return this.http.get(baseURL + '/userhorse/' + userId, httpOptions).toPromise();
  }
}
