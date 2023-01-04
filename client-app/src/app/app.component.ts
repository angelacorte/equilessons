import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "./_services/token-storage.service";
import {ClubInfos, UserInfos} from "./_utils/Person";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'equilessons';

  isLoggedIn = false;
  username?: string;
  isClub = false;
  infos !: ClubInfos | UserInfos
  constructor(private tokenStorageService: TokenStorageService) {
  }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      this.isClub = this.tokenStorageService.isClub();
      this.infos = this.tokenStorageService.getInfos(this.isClub);
      // @ts-ignore
      this.username = this.isClub ? this.infos['clubName'] : this.infos['name']
    }
  }

  logout(): void {
    this.tokenStorageService.logout();
    window.location.replace("/");
  }
}
