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

  clubs: {_id: string, clubName: string}[] = [];
  hide = true;
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private http: HttpClient, private clubService: ClubService, private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {

    if (!!this.tokenStorage.getToken()) { //if user is logged in
      window.location.assign('home');
    }else{
      this.fetchData();
    }
  }

  private fetchData() {
    this.clubService.getAllClubs().pipe(map(responseData => {
      const dataArray = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;
    })).subscribe(response => {
      this.clubs = response;
    });
  }

  onSubmit(): void {
    let user = this.form;

    this.authService.signup(user).subscribe(
      data => {
        if (data.status == 200) {
          this.openSnackbar("Registrazione avvenuta con successo, vai al login.", "login");
        } else if (data.status == 409) {
          this.openSnackbar("Utente già registrato.", "retry");
        }else if(data.status == 400){
          this.openSnackbar("La registrazione non è andata a buon fine, riprova.", "reload");
        }
      },
      () => {
        this.openSnackbar("La registrazione non è andata a buon fine, riprova.", "reload");
      }
    );
  }

  private openSnackbar(message: string, option: string) { //todo maybe change into enum
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    if(option == 'login'){
      snackBarRef.afterDismissed().subscribe(()=>{
        window.location.assign('/login');
      })
    }else if(option == 'reload'){
      snackBarRef.afterDismissed().subscribe(()=>{
        window.location.reload();
      })
    }
  }
}
