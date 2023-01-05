import {Component, OnInit} from '@angular/core';
import { SocketIoService } from './_services/socket-io.service';
import {TokenStorageService} from "./_services/token-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'equilessons';

  private roles: string[] = [];
  isLoggedIn = false;
  username?: string;
  isClub = false;

  constructor(private tokenStorageService: TokenStorageService, private socketIoService: SocketIoService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if(this.isLoggedIn){
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      if(user.user === undefined){
        this.username = user.club.clubName;
        this.isClub = true;
      }else{
        this.username = user.user.username;
      }
    }
  }

  logout(): void {
    this.tokenStorageService.logout();
    window.location.replace("/");
  }
}
