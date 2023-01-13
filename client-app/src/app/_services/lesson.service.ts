import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CalendarSchedulerEventAction} from "angular-calendar-scheduler";
import {LessonState} from "../_utils/Lesson";
import {TokenStorageService} from "./token-storage.service";
import {ht} from "date-fns/locale";

const baseURL = 'http://localhost:5050';

let httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  createLesson(data:any): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(baseURL + '/lesson', data, header).toPromise()
  }

  getLesson(lessonId: string): Promise<any> {
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/lesson/' + lessonId, header).toPromise()
  }

  getLessonsByClubId(clubId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/lesson/getInfo/' + clubId, header).toPromise();
  }

  deleteLesson(lessonId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.delete(baseURL + '/removelesson/' + lessonId, header).toPromise();
  }

  updateLesson(lesson:any):Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(baseURL + '/lesson/update', lesson, header).toPromise();
  }

  getUserLessons(userId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/lesson/user/' + userId, header).toPromise()
  }

  getCoachLesson(coachId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(baseURL + '/lesson/coach/' + coachId, header).toPromise();
  }
}
