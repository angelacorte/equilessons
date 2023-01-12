import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CalendarSchedulerEventAction} from "angular-calendar-scheduler";
import {LessonState} from "../_utils/Lesson";
import {TokenStorageService} from "./token-storage.service";
import {ht} from "date-fns/locale";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  createLesson(data:any): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(baseURL + '/lesson', data, httpOptions).toPromise();
  }

  getLesson(lessonId: string): Promise<any> {
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/lesson/' + lessonId, httpOptions).toPromise()
  }

  getLessonsByClubId(clubId: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/lesson/getInfo/' + clubId, httpOptions).toPromise();
  }

  deleteLesson(lessonId: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.delete(baseURL + '/removelesson/' + lessonId, httpOptions).toPromise();
  }

  updateLesson(lesson:any):Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.post(baseURL + '/lesson/update', lesson, httpOptions).toPromise();
  }

  getUserLessons(userId: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/lesson/user/' + userId, httpOptions).toPromise()
  }

  getCoachLesson(coachId: string): Promise<any>{
    httpOptions.headers.append('Authorization', this.tokenStorage.getToken() + '')
    return this.http.get(baseURL + '/lesson/coach/' + coachId, httpOptions).toPromise();
  }
}
