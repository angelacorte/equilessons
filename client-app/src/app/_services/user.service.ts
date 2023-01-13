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

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  //This provides methods to access public and protected resources

  addRole(role:Roles, id:string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(baseURL + '/user/roles', {role, id}, header).toPromise();
  }
  removeRole(role: Roles, id: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    let options = {
      options: header,
      body: {role, id}
    }
    return this.http.delete(baseURL + '/user/removeRole', options).toPromise();
  }

  getUserRoles(id:string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/user/roles/' + id, header).toPromise();
  }

  removeUser(data:any): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    let options = {
      options: header,
      body: data
    }
    return this.http.delete(baseURL + '/user', options).toPromise();
  }

  updateUser(data: UserInfos): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(baseURL + '/user/updateUser', data, header).toPromise();
  }

  getUserById(userId:string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/userinfo/' + userId, header).toPromise();
  }

  getUserHorses(userId:string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/userhorse/' + userId, header).toPromise();
  }

  addUserHorse(id: string, horseId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(baseURL + '/user/add-horse', {id, horseId}, header).toPromise();
  }

  removeUserHorse(id: string, horseId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    let options = {
      options: header,
      body: {id, horseId}
    }
    return this.http.delete(baseURL + '/user/remove-horse', options).toPromise();
  }
}
