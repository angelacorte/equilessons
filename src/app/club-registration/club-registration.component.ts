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
    clubPassword: ',',
    clubCity: '',
    clubAddress: '',
    //clubOwnerId: ''
  };

  isSuccessful = false;
  isRegistrationFailed = false;
  errorMessage = '';
  submitted = false;
  isLoggedIn = false;
  //infos: any;

  constructor(private http: HttpClient, private clubService: ClubService, private tokenStorage: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    /*this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn){
      this.infos = this.tokenStorage.getUser();
    }*/
  }

  onSubmit(): void{

    const registration = {
      clubName: this.form.clubName,
      clubEmail: this.form.clubEmail,
      clubPassword: this.form.password,
      clubTelephone: this.form.clubTelephone,
      clubCity: this.form.clubCity,
      clubAddress: this.form.clubAddress,
      //clubOwnerId: this.infos.user._id
    };

/*    const role = 'club-owner';
    let tmpRole = this.infos.user['roles'];
    tmpRole.push(role);*/

    this.clubService.registration(registration).subscribe(response=>{


    });

    /*this.clubService.registration(registration).subscribe(response=>{
        this.submitted = true;
        console.log("response club service registration ", response);
        this.userService.changeClub(registration.clubOwnerId, response._id).subscribe(r=>{
            this.userService.addRole(role, registration.clubOwnerId).subscribe(resp =>{
              console.log("updated user");
              console.log("response.id", response._id);
//              this.tokenStorage.modifyUserClub(response._id);
              this.infos.user['clubId'] = response._id;
              this.infos.user['roles'] = tmpRole;
              this.tokenStorage.saveUser(this.infos);
              this.isSuccessful = true;

              //console.log("this.infos.user['clubId']", this.infos.user['clubId']);
            },
                e => {
              console.log(e);
            })
        },
          er=>{
          console.log(er);
          })
      },
      err => {
        this.errorMessage = err.error.message;
        this.isRegistrationFailed = true;
        console.log(err);
      })*/
  }
}
