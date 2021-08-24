import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {ClubService} from "../_services/club.service";
import {AuthService} from "../_services/auth.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Component({
  selector: 'app-club-registration',
  templateUrl: './club-registration.component.html',
  styleUrls: ['./club-registration.component.css']
})
export class ClubRegistrationComponent implements OnInit {

  form:any = {
    clubName: '',
    clubEmail: '',
    clubTelephone: '',
    clubCity: '',
    clubAddress: '',
    clubOwnerId: ''
  };

  isSuccessful = false;
  isRegistrationFailed = false;
  errorMessage = '';
  submitted = false;
  isLoggedIn = false;
  infos: any;

  constructor(private http: HttpClient, private clubService: ClubService, private tokenStorage: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn){
      this.infos = this.tokenStorage.getUser();
      console.log("profile ngoninit infos", this.infos);
    }
  }

  onSubmit(): void{

    const registration = {
      clubName: this.form.clubName,
      clubEmail: this.form.clubEmail,
      clubTelephone: this.form.clubTelephone,
      clubCity: this.form.clubCity,
      clubAddress: this.form.clubAddress,
      clubOwnerId: this.infos.user._id
    };

    const role = 'club-owner';

    this.clubService.registration(registration).subscribe(response=>{
        this.submitted = true;
        this.isSuccessful = true;
        this.userService.addRole(role, registration.clubOwnerId).subscribe(resp =>{
          console.log("updated user");
        },
          e => {
            console.log(e);
          })
      },
      err => {
        this.errorMessage = err.error.message;
        this.isRegistrationFailed = true;
        console.log(err);
      })


    /*http.post(baseURL + '/club', { }, httpOptions)
      .subscribe(response=>{
        console.log("club registration", registration);
        console.log("response club registration ", response);
        this.submitted = true;
        this.isSuccessful = true;
      },
        err => {
        this.errorMessage = err.error.message;
        this.isRegistrationFailed = true;
          console.log(err);
        })*/
  }
}
