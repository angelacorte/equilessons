import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CalendarSchedulerEventAction} from "angular-calendar-scheduler";
import {LessonState} from "../_utils/Lesson";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

let lessonData !: LessonState;
const KEY = "lesson-data";

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient) { }

  createLesson(data:any): Promise<any>{
    return this.http.post(baseURL + '/lesson', data, httpOptions).toPromise();
  }

  getLessonsByClubId(clubId: string): Promise<Object>{
    return this.http.get(baseURL + '/lesson/getInfo/' + clubId, httpOptions).toPromise();
  }

  deleteLesson(lessonId: string): Promise<Object>{
    return this.http.delete(baseURL + '/removelesson/' + lessonId, {responseType: 'json'}).toPromise();
  }

  updateLesson(lesson:any):Promise<any>{
    return this.http.post(baseURL + '/lesson/update', lesson, {responseType: 'json'}).toPromise();
  }
}
