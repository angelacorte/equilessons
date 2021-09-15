import { Component, OnInit } from '@angular/core';
import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
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
    let registration = this.form;

    this.clubService.clubLogin(registration).subscribe(data=>{
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
