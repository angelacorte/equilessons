import { Component, OnInit } from '@angular/core';
import { AuthService} from "../_services/auth.service";
import { TokenStorageService} from "../_services/token-storage.service";
import {LoginMessages} from "../_utils/Utils";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form:any = {
    username: "",
    password: ""
  };

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  username?: string;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void{
    const {username, password} = this.form;

    this.authService.login(username, password).subscribe(
      data => {
        switch (data.status) {
          case 404:
            this.isLoginFailed = true;
            this.errorMessage = LoginMessages.FAILED
            break;
          case 401:
            this.isLoginFailed = true;
            this.errorMessage = LoginMessages.FAILED
            break;
          case 200:
            this.tokenStorage.saveToken(data.accessToken);
            this.tokenStorage.saveUser(data);
            this.isLoggedIn = true
            this.roles = this.tokenStorage.getUser().roles;
            this.reloadPage();
            break;
          case 500:
            this.isLoginFailed = true;
            this.errorMessage = LoginMessages.ERROR
            break
        }
      },
      err => {
        this.errorMessage = err.statusText;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.assign('/home');
  }

}