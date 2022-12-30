import {Component, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, Validators} from "@angular/forms";
import {SignupMessages, SnackBarActions} from "../_utils/Utils";

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
        switch (data.status) {
          case 200:
            this.openSnackbar(SignupMessages.LOGIN, SnackBarActions.LOGIN);
            break;
          case 409:
            this.openSnackbar(SignupMessages.ALREADY_EXISTS, SnackBarActions.RETRY);
            break;
          case 400:
            this.openSnackbar(SignupMessages.FAILED, SnackBarActions.RELOAD);
            break;
        }
      },
      () => {
        this.openSnackbar(SignupMessages.FAILED, SnackBarActions.RELOAD);
      }
    );
  }

  private openSnackbar(message: string, option: SnackBarActions) {
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=> {
      switch (option) {
        case SnackBarActions.LOGIN:
          window.location.assign('/login');
          break;
        case SnackBarActions.RELOAD || SnackBarActions.RETRY:
          window.location.reload();
      }
    })
  }
}
