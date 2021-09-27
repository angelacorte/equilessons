import { Component, OnInit } from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  form: any = {
    name: "",
    surname: "",
    email: "",
    birthday: "",
    username: "",
    password: "",
    phoneNumber: "",
    taxcode: "",
    city: "",
    address: "",
    nrFise: "",
    clubId: "",
    isOwner: false
  };

  clubs = [];
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isSelected = false;

  constructor(private authService: AuthService, private http: HttpClient, private clubService: ClubService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {

    if(!!this.tokenStorage.getToken()){ //if user is logged in
      window.location.assign('home');
    }
    this.fetchData();
  }

  private fetchData(){
    this.clubService.getAllClubs().pipe(map(responseData=>{
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;

    })).subscribe(response=>{
      // @ts-ignore
      this.clubs = response;
    });
  }

  onSubmit(): void{

    /*const {
      name,
      surname,
      email,
      birthday,
      username,
      password,
      phoneNumber,
      taxcode,
      city,
      address,
      nrFise,
      clubId,
      isOwner
    } = this.form;*/

    let user = this.form;

    this.authService.signup(user).subscribe(
        data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          // this.reloadPage();
        },
      err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
      }
    );
  }

  isChecked() {
    this.isSelected = true;
    this.form.isOwner = this.isSelected;
  }

  // reloadPage(): void {
  //   window.location.assign("/login");
  // }
}
