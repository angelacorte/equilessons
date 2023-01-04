import {Injectable} from '@angular/core';
import {LessonService} from "./lesson.service";
import {ClubInfos, UserInfos} from "../_utils/Person";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const CLUB_KEY = 'auth-club';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private lessonService:LessonService) { }

  logout(): void{
/*    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(CLUB_KEY)*/
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  public removeItems(){
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(CLUB_KEY);
  }
  public saveUser(user: ClubInfos){
    this.removeItems()
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public saveClub(club: ClubInfos){
    this.removeItems()
    localStorage.setItem(CLUB_KEY, JSON.stringify(club))
  }

  public getUser() {
    const user = localStorage.getItem(USER_KEY);
    if(user) return JSON.parse(user);
    else return null;
  }

  public getClub(){
    const club = localStorage.getItem(CLUB_KEY);
    if(club) return JSON.parse(club);
    else return null;
  }
  public isClub(): boolean{
    return !localStorage.getItem(USER_KEY)
  }

  public getInfos(isClub:boolean){
    return isClub ? this.getClub() : this.getUser();
  }
/*
  public isCoach(infos: any): boolean{
    return infos['roles'].indexOf('coach') > -1;
  }*/
}
