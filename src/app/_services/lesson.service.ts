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

  createLesson(data:any): Observable<any>{
    return this.http.post(baseURL + '/lesson', data, httpOptions);
  }

  getClubsLessons(clubId: string): Observable<any> {
    return this.http.get(baseURL + '/lesson/' + clubId, httpOptions);
  }

  getLessonsInfos(clubId: string): Promise<Object>{
    return this.http.get(baseURL + '/lesson/getInfo/' + clubId, httpOptions).toPromise();
  }

  saveLessonState(data: LessonState){
    window.sessionStorage.setItem(KEY, JSON.stringify(data));
  }

  getLessonState():LessonState{
    const lesson = window.sessionStorage.getItem(KEY);
    if(lesson) return JSON.parse(lesson);
    else return lessonData;
  }

  updateLesson(lesson:any):Observable<any>{
    return this.http.post(baseURL + '/lesson/update', lesson, httpOptions);
  }

  deleteLessonState(){
    window.sessionStorage.removeItem(KEY);
  }
}
