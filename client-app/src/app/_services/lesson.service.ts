import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenStorageService} from "./token-storage.service";
import { BASE_URL } from 'app/_utils/Global';


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
    return this.http.post(BASE_URL + '/lesson', data, header).toPromise()
  }

  getLesson(lessonId: string): Promise<any> {
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/lesson/' + lessonId, header).toPromise()
  }

  getLessonsByClubId(clubId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/lesson/getInfo/' + clubId, header).toPromise();
  }

  deleteLesson(lessonId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.delete(BASE_URL + '/removelesson/' + lessonId, header).toPromise();
  }

  updateLesson(lesson:any):Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.post(BASE_URL + '/lesson/update', lesson, header).toPromise();
  }

  getUserLessons(userId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/lesson/user/' + userId, header).toPromise()
  }

  getCoachLesson(coachId: string): Promise<any>{
    let header = { headers: new HttpHeaders()
        .set('Authorization',  `${this.tokenStorage.getToken()}`)
        .set('Content-Type', 'application/json')
    }
    return this.http.get(BASE_URL + '/lesson/coach/' + coachId, header).toPromise();
  }
}
