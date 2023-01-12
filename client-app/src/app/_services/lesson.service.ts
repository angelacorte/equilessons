import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CalendarSchedulerEventAction} from "angular-calendar-scheduler";
import {LessonState} from "../_utils/Lesson";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient) { }

  createLesson(data:any): Promise<any>{
    return this.http.post(baseURL + '/lesson', data, httpOptions).toPromise();
  }

  getLesson(lessonId: string): Promise<any> {
    return this.http.get(baseURL + '/lesson/' + lessonId).toPromise()
  }

  getLessonsByClubId(clubId: string): Promise<any>{
    return this.http.get(baseURL + '/lesson/getInfo/' + clubId).toPromise();
  }

  deleteLesson(lessonId: string): Promise<any>{
    return this.http.delete(baseURL + '/removelesson/' + lessonId, {responseType: 'json'}).toPromise();
  }

  updateLesson(lesson:any):Promise<any>{
    return this.http.post(baseURL + '/lesson/update', lesson, {responseType: 'json'}).toPromise();
  }

  getUserLessons(userId: string): Promise<any>{
    return this.http.get(baseURL + '/lesson/user/' + userId, {responseType: 'json'}).toPromise()
  }

  getCoachLesson(coachId: string): Promise<any>{
    return this.http.get(baseURL + '/lesson/coach/' + coachId, {responseType: 'json'}).toPromise();
  }
}
