import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";
import {LoginMessages} from "../_utils/Utils";
import {Router} from "@angular/router";

@Component({
  selector: 'app-club-login',
  templateUrl: './club-login.component.html',
  styleUrls: ['./club-login.component.css']
})
export class ClubLoginComponent implements OnInit {

  form:any={
    clubEmail:'',
    clubPassword:''
  }
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  username?: string;


  constructor(private tokenStorage: TokenStorageService, private clubService: ClubService, private router: Router) { }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.isLoggedIn = true;
    }
  }

  onSubmit() {
    let login = this.form;

    this.clubService.clubLogin(login).then(res => {
      switch (res.status){
        case 404:
          this.isLoginFailed = true;
          this.errorMessage = LoginMessages.FAILED
          break;
        case 401:
          this.isLoginFailed = true;
          this.errorMessage = LoginMessages.FAILED
          break;
        case 200:
          this.isLoggedIn = true
          this.tokenStorage.saveToken(res.accessToken);
          this.tokenStorage.saveClub(res.club);
          window.location.assign('calendar')
          // this.router.navigateByUrl('calendar')
          break;
        case 500:
          this.errorMessage = LoginMessages.ERROR
          this.isLoginFailed = true;
          break;
      }
    })
  }
}
