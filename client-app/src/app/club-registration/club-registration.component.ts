import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ClubService} from "../_services/club.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {SignupMessages, SnackBarActions} from "../_utils/Utils";
import {MatSnackBar} from "@angular/material/snack-bar";


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
    clubPassword: '',
    clubCity: '',
    clubAddress: '',
  };

  isSuccessful = false;
  isLoggedIn = false;
  hide = true;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private clubService: ClubService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if (!!this.tokenStorage.getToken()) { //if user is logged in
      window.location.assign('home');
    }
  }

  onSubmit(): void{

    const registration = {
      clubName: this.form.clubName,
      clubEmail: this.form.clubEmail,
      clubPassword: this.form.clubPassword,
      clubTelephone: this.form.clubTelephone,
      clubCity: this.form.clubCity,
      clubAddress: this.form.clubAddress,
    };

    this.clubService.registration(registration).then(response=>{
      switch (response.status) {
        case 409:
          this.openSnackbar(SignupMessages.ALREADY_EXISTS, SnackBarActions.RETRY);
          break;
        case 200:
          this.openSnackbar(SignupMessages.LOGIN, SnackBarActions.LOGIN);
          break;
        case 400:
          this.openSnackbar(SignupMessages.FAILED, SnackBarActions.RELOAD);
          break;
        }
      }, () => {this.openSnackbar(SignupMessages.FAILED, SnackBarActions.RELOAD); }
    );
  }
  private openSnackbar(message: string, option: SnackBarActions) {
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=> {
      switch (option) {
        case SnackBarActions.LOGIN:
          window.location.assign('/clubLogin');
          break;
        case SnackBarActions.RELOAD || SnackBarActions.RETRY:
          window.location.reload();
      }
    })
  }
}
