import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";

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


  constructor(private tokenStorage: TokenStorageService, private clubService: ClubService) { }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit() {
    let login = this.form;

    this.clubService.clubLogin(login).subscribe(data=>{
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.assign('/home');
  }
}
