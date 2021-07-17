import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user.model';

const baseURL = 'http://localhost:5050'; //TODO ????

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  //This provides methods to access public and protected resources

  signup(data:any): Observable<any>{
    return this.http.post(baseURL,data);
  }

  getPublicContent(): Observable<any> {
    return this.http.get(baseURL + 'all', { responseType: 'text' });
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
