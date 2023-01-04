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

    this.authService.login(username, password).then(res => {
      switch (res.status) {
        case 404:
          this.isLoginFailed = true;
          this.errorMessage = LoginMessages.FAILED
          break;
        case 401:
          this.isLoginFailed = true;
          this.errorMessage = LoginMessages.FAILED
          break;
        case 200:
          this.tokenStorage.saveToken(res.accessToken);
          this.tokenStorage.saveUser(res.user);
          this.roles = this.tokenStorage.getUser().roles;
          this.isLoggedIn = true
          break;
        case 500:
          this.isLoginFailed = true;
          this.errorMessage = LoginMessages.ERROR
          break
      }
    })
  }
}
