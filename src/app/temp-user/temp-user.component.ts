import { Component, OnInit } from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {HttpClient} from "@angular/common/http";
import {ClubService} from "../_services/club.service";
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-temp-user',
  templateUrl: './temp-user.component.html',
  styleUrls: ['./temp-user.component.css']
})
export class TempUserComponent implements OnInit {

  form: any = {
    name: "",
    surname: "",
    phoneNumber: "",
    password: "",
    clubId: ""
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isSelected = false;
  isLoggedIn = false;
  infos: any;

  constructor(private authService: AuthService, private http: HttpClient, private clubService: ClubService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
    }else{
      window.location.assign('/notAllowed');
    }
  }

  onSubmit(){
    let tmpUser = this.form;
    tmpUser.clubId = this.infos._id;

    this.authService.signup(tmpUser).subscribe(
      data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        //this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );

  }

  reloadPage(): void {
    window.location.assign('/clubUsers');
  }
}
