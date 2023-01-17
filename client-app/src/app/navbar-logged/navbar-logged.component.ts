import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-navbar-logged',
  templateUrl: './navbar-logged.component.html',
  styleUrls: ['./navbar-logged.component.css']
})
export class NavbarLoggedComponent{

  isLoggedIn !: boolean
  isClub !: boolean
  isCoach !: boolean
  constructor(private tokenStorage: TokenStorageService) {
    this.isLoggedIn = !!tokenStorage.getToken()
    this.isClub = tokenStorage.isClub()
    this.isCoach = tokenStorage.isCoach()
  }

  logout() {
    this.tokenStorage.logout();
    window.location.replace("/");
  }
}
