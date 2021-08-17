import { Component, OnInit } from '@angular/core';
import {AuthService} from "../_services/auth.service";
import { FormGroup, FormControl } from '@angular/forms';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

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
    telephone: "",
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

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData(){
    this.http.get(baseURL + '/club', httpOptions).pipe(map(responseData=>{
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

    const {
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
    } = this.form;

    this.authService.signup(name,
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
      isOwner).subscribe(
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
