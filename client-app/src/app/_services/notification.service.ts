import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { NotificationMessage } from '../_utils/Notification';
import { BASE_URL } from '../_utils/Global';
import {TokenStorageService} from "./token-storage.service";

const httpOption = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  createNotification(data: NotificationMessage): Promise<any> {
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(BASE_URL + '/notification', data, header).toPromise()
  }

  getNotifications(userId: string): Promise<any> {
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/notification/' + userId, header).toPromise()
  }

  deleteNotification(notificationId: string): Promise<any> {
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/notification/delete/' + notificationId, header).toPromise()
  }
}
