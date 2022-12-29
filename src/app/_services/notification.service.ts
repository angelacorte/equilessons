import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { NotificationMessage } from '../_utils/Notification';
import { BASE_URL } from '../_utils/Global';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications(userId: string): Promise<any> {
    return this.http.get(BASE_URL + '/notification/' + userId).toPromise()
  }
}
