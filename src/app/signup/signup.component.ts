import { Component, OnInit } from '@angular/core';
import {AuthService} from "../_services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  form: any = {
    name: null,
    surname: null,
    taxcode: null,
    email: null,
    telephone: null,
    birthday: null,
    birthLocation: null,
    nationality: null,
    username: null,
    password: null,
    city: null,
    cap: null,
    address: null,
    county: null,
    nrFise: null,
    club: null,
    owner: null
  };

  isSuccessful = false;
  isSignupFailed = false;
  errorMsg = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
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
          console.log(data);
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
