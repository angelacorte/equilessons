import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-navbar-not-logged',
  templateUrl: './navbar-not-logged.component.html',
  styleUrls: ['./navbar-not-logged.component.css']
})
export class NavbarNotLoggedComponent {

  isLoggedIn !: boolean
  constructor(private tokenStorage: TokenStorageService) {
    this.isLoggedIn = !!tokenStorage.getToken()
  }

}
