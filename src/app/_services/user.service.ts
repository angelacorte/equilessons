import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { User } from '../_models/user.model';

const baseURL = 'http://localhost:5050';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  //This provides methods to access public and protected resources

  getPublicContent(): Observable<any> {
    return this.http.get(baseURL + 'all', { responseType: 'text' });
  }

  addRole(role:any, id:any): Observable<any>{
    return this.http.post(baseURL + '/user/roles', {role, id});
  }

  getUserRoles(id:any): Observable<any>{
    return this.http.get(baseURL + '/user/roles/' + id);
  }

  getUsersByClub(clubId:any): Observable<any>{
    return this.http.get(baseURL + '/user/' + clubId);
  }

  changeClub(userId:any, clubId:any): Observable<any>{
    return this.http.post(baseURL + '/user/changeClub', {userId, clubId});
  }
  /*
  get(id: any): Observable<User> {
    return this.http.get(`${baseUrl}/${id}`);
  }

    findByTitle(title: any): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}?title=${title}`);
  }
   */
}
