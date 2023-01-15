import {Component, Input, OnInit} from '@angular/core';
import { UserService } from '../_services/user.service';
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubInfos, UserInfos} from "../_utils/Person";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() isLoggedIn = false;
  infos!: ClubInfos | UserInfos;
  user: any;
  isClub = false;

  constructor(private userService: UserService, private tokenStorage:TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if(this.isLoggedIn) {
      this.isClub = this.tokenStorage.isClub();
      this.infos = this.tokenStorage.getInfos(this.isClub);
    }
  }
}
