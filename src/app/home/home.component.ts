import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import {TokenStorageService} from "../_services/token-storage.service";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;
  isLoggedIn = false;
  infos: any;
  user: any;
  isClub = false;

  constructor(private userService: UserService, private tokenStorage:TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn) {
      this.infos = this.tokenStorage.getUser();
      this.isClub = this.tokenStorage.isClub();
      console.log("isclub", this.isClub)
      if(this.infos.user === undefined){
        this.user = this.infos.club;
        console.log("user", this.user)
      }else{
        this.user = this.infos['user'];
      }
    }
    this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
}
