import { Component, OnInit } from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {FormControl, Validators} from "@angular/forms";
import {ClubService} from "../_services/club.service";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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
    taxcode: "",
    email: "",
    telephone: "",
    birthday: "",
    birthLocation: "",
    nationality: "",
    username: "",
    password: "",
    city: "",
    cap: "",
    address: "",
    county: "",
    nrFise: "",
    club: "",
    owner: ""
  };

  clubs = [];
  isSuccessful = false;
  isSignupFailed = false;
  errorMsg = '';

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData(){
    console.log("fetch data");
    this.http.get(baseURL + '/club', httpOptions).pipe(map(responseData=>{
      const dataArray = [];
      console.log("response data ", responseData);
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;

    })).subscribe(response=>{
      console.log('response ', response);
      // @ts-ignore
      this.clubs = response;
      this.clubs.forEach((club: any)=>{
        console.log("club ", club);
      })
    });
  }

  onSubmit(): void{
    const {
      name,
      surname,
      taxcode,
      email,
      telephone,
      birthday,
      birthLocation,
      nationality,
      username,
      password,
      city,
      cap,
      address,
      county,
      nrFise,
      club,
      owner
    } = this.form;

    this.authService.signup(name, surname, taxcode, email, telephone, birthday, birthLocation, nationality, username, password,
      city, cap, address, county, nrFise, club, owner).subscribe(
        data => {
          console.log('signup components ', data);
          this.isSuccessful = true;
          this.isSignupFailed = false;
        },
      err => {
          this.errorMsg = err.error.message;
          this.isSignupFailed = true;
      }
    );

  }

}
