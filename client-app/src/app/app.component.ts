import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TokenStorageService} from "./_services/token-storage.service";
import {ClubInfos, UserInfos} from "./_utils/Person";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Equilessons';

  @Input() isLoggedIn = false;
  @Input() username?: string;
  isClub = false;
  infos !: ClubInfos | UserInfos
  isCoach!: boolean;
  constructor(private tokenStorage: TokenStorageService, private router: Router) {
  }

  ngOnInit() {
    if (this.isLoggedIn) {
      this.isClub = this.tokenStorage.isClub();
      this.infos = this.tokenStorage.getInfos(this.isClub);
      if(!this.isClub) this.isCoach = this.tokenStorage.isCoach()
    }else{
      this.router.events.subscribe(event => {
        if (event.constructor.name === "NavigationEnd") {
          this.isLoggedIn = !!this.tokenStorage.getToken();
          this.isClub = this.tokenStorage.isClub()
          if(!this.isClub) this.isCoach = this.tokenStorage.isCoach()
          this.infos = this.tokenStorage.getInfos(this.isClub)
        }
      })
    }
  }
  logout(): void {
    this.tokenStorage.logout();
    window.location.replace("/");
  }
}
