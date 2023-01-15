import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Roles, UserInfos} from "../_utils/Person";
import {TokenStorageService} from "./token-storage.service";
import { BASE_URL } from 'app/_utils/Global';

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
    return this.http.post(BASE_URL + '/user/roles', {role, id}, header).toPromise();
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
    return this.http.delete(BASE_URL + '/user/removeRole', options).toPromise();
  }

  getUserRoles(id:string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/user/roles/' + id, header).toPromise();
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
    return this.http.delete(BASE_URL + '/user', options).toPromise();
  }

  updateUser(data: UserInfos): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(BASE_URL + '/user/updateUser', data, header).toPromise();
  }

  getUserById(userId:string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/userinfo/' + userId, header).toPromise();
  }

  getUserHorses(userId:string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/userhorse/' + userId, header).toPromise();
  }

  addUserHorse(id: string, horseId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(BASE_URL + '/user/add-horse', {id, horseId}, header).toPromise();
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
    return this.http.delete(BASE_URL + '/user/remove-horse', options).toPromise();
  }
}
