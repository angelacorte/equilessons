import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { NotificationMessage } from '../_utils/Notification';
import { BASE_URL } from '../_utils/Global';
import {TokenStorageService} from "./token-storage.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  createNotification(data: NotificationMessage): Promise<any> {
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(BASE_URL + '/notification', data, httpOptions).toPromise()
  }

  getNotifications(userId: string): Promise<any> {
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(BASE_URL + '/notification/' + userId, httpOptions).toPromise()
  }

  deleteNotification(notificationId: string): Promise<any> {
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(BASE_URL + '/notification/delete/' + notificationId, httpOptions).toPromise()
  }
}
