import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Roles, UserInfos} from "../_utils/Person";
import {TokenStorageService} from "./token-storage.service";
// import { User } from '../_models/user.model';

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  //This provides methods to access public and protected resources

  addRole(role:Roles, id:string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(baseURL + '/user/roles', {role, id}, httpOptions).toPromise();
  }
  removeRole(role: Roles, id: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    let options = {
      options: httpOptions,
      body: {role, id}
    }
    return this.http.delete(baseURL + '/user/removeRole', options).toPromise();
  }

  getUserRoles(id:string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/user/roles/' + id, httpOptions).toPromise();
  }

  removeUser(data:any): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    let options = {
      options: httpOptions,
      body: data
    }
    return this.http.delete(baseURL + '/user', options).toPromise();
  }

  updateUser(data: UserInfos): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(baseURL + '/user/updateUser', data, httpOptions).toPromise();
  }

  getUserById(userId:string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/userinfo/' + userId, httpOptions).toPromise();
  }

  getUserHorses(userId:string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/userhorse/' + userId, httpOptions).toPromise();
  }

  addUserHorse(id: string, horseId: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(baseURL + '/user/add-horse', {id, horseId}).toPromise();
  }

  removeUserHorse(id: string, horseId: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    let options = {
      options: httpOptions,
      body: {id, horseId}
    }
    return this.http.delete(baseURL + '/user/remove-horse', options).toPromise();
  }
}
