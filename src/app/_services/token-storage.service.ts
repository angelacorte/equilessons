import { Injectable } from '@angular/core';
import {LessonService} from "./lesson.service";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private lessonService:LessonService) { }

  logout(): void{
    this.lessonService.deleteLessonState();
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if(user){
      return JSON.parse(user);
    }
    return {};
  }

  public isClub(): boolean{
    const user = this.getUser();
    if(user.user === undefined){
      return true;
    }
    return false;
  }

  public getInfos(isClub:boolean):any{
    let user;
    if(isClub){
      user = this.getUser().club;
    }else{
      user = this.getUser().user;
    }
    return user;
  }
}
