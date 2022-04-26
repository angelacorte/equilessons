import { Component, OnInit } from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, Validators} from "@angular/forms";

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
  };

  clubs = [];
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  hide = true;
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  constructor(private authService: AuthService,private _snackBar: MatSnackBar, private http: HttpClient, private clubService: ClubService, private tokenStorage: TokenStorageService) { }

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
    let user = this.form;

    this.authService.signup(user).subscribe(
        data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          let snackBarRef = this._snackBar.open("Registrazione con successo", "Ok", {
            duration: 5000
          });
          snackBarRef.afterDismissed().subscribe(()=>{
            window.location.assign('/login');
          })
        },
      err => {
        this._snackBar.open("La registrazione non è andata a buon fine", "Ok", {
          duration: 5000
        });
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
