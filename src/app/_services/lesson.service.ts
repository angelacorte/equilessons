import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CalendarSchedulerEventAction} from "angular-calendar-scheduler";

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

  getClubsLessons(clubId: any): Observable<any> {
    return this.http.get(baseURL + '/lesson/' + clubId, httpOptions);
  }

  getLessonsInfos(clubId: any): Observable<any>{
    return this.http.get(baseURL + '/lesson/getInfo/' + clubId, httpOptions);
  }

  saveLessonState(data: LessonState){
    window.sessionStorage.setItem(KEY, JSON.stringify(data));
  }

  getLessonState():LessonState{
    const lesson = window.sessionStorage.getItem(KEY);
    if(lesson) return JSON.parse(lesson);
    else return lessonData;
  }

  updateLesson(){

  }

  deleteLessonState(){
    window.sessionStorage.removeItem(KEY);
  }

  // getEvents(actions: CalendarSchedulerEventAction[]) {
  //
  // }
  /*getEvents(actions: CalendarSchedulerEventAction[]): Observable<any> {
    return throwError("method to implement");
  }*/
  matchPairs(lesson: any):any {
    let pairs = lesson['pairs'];
    let riders_in_lesson = lesson['riders_in_lesson'];
    let horses_in_lesson = lesson['horses_in_lesson'];
    let lessonRefactored = {
      beginDate: lesson.beginDate,
      endDate: lesson.endDate,
      arenaName: lesson.arena[0]['arenaName'],
      coach: {
        coachId: lesson.coach[0]['_id'],
        coachName: lesson.coach[0]['name'],
        coachSurname: lesson.coach[0]['surname']
      },
      pairs: []
    };

    pairs.forEach((value: any)=>{
      riders_in_lesson.forEach((rider: { _id: string; name: string; surname: string; })=>{
        if(rider._id === value.riderId){
          let riderInfo = {
            riderId: rider._id,
            riderName:rider.name,
            riderSurname:rider.surname
          }

          horses_in_lesson.forEach((horse: { _id: string; horseName: string; })=>{
            if(horse._id === value.horseId){
              let horseInfo = {
                horseId: horse._id,
                horseName: horse.horseName
              }
              let couple = {
                riderInfo: riderInfo,
                horseInfo: horseInfo
              }
              // @ts-ignore
              lessonRefactored.pairs.push(couple);
            }
          })
        }
      })
    })
    return lessonRefactored;
  }
}

export interface LessonState {
  _id:any,
  beginDate: any,
  endDate: any,
  arenaName: any,
  coach: any,
  horses_in_lesson: any,
  riders_in_lesson: any,
  pairs: any
}
