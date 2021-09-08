import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CalendarSchedulerEventAction} from "angular-calendar-scheduler";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient) { }

  createLesson(data:any): Observable<any>{
    return this.http.post(baseURL + '/lesson', data, httpOptions);
  }

  getClubsLessons(clubId: any): Observable<any> {
    return this.http.get(baseURL + '/lesson/' + clubId, httpOptions);
  }

  // getEvents(actions: CalendarSchedulerEventAction[]) {
  //
  // }
  /*getEvents(actions: CalendarSchedulerEventAction[]): Observable<any> {
    return throwError("method to implement");
  }*/
}
