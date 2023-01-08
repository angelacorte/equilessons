import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {ClubService} from "../_services/club.service";
import {Observable, Observer} from "rxjs";
import {ClubInfos, UserInfos} from "../_utils/Person";

export interface ProfileTab{
  label: string,
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {

  asyncTabsClub: Observable<ProfileTab[]>;
  asyncTabs: Observable<ProfileTab[]>;

  roles: string[] = [];
  isLoggedIn = false;
  infos!: UserInfos | ClubInfos;
  isClub: boolean = false;

  constructor(private tokenStorage: TokenStorageService, private userService: UserService) {
    this.asyncTabsClub = new Observable((observer: Observer<ProfileTab[]>) => {
      setTimeout(() => {
        observer.next([
          {label: 'Gestione Campi'},
          {label: 'Gestione Cavalli'},
          {label: 'Gestione Istruttori'},
          {label: 'Gestione Utenti'},
          {label: 'Informazioni Personali'},
        ]);
      }, 1000);
    });

    this.asyncTabs = new Observable((observer: Observer<ProfileTab[]>) => {
      setTimeout(() => {
        observer.next([
          {label: 'Gestione Cavalli'},
          {label: 'Informazioni Personali'}
        ]);
      }, 1000);
    });
  }

  async ngOnInit() {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      this.isClub = this.tokenStorage.isClub();
      this.infos = this.tokenStorage.getInfos(this.isClub);
      if(this.infos){
        if (!this.isClub) {
          this.roles = await this.getRoles()
        }
      }

      //this.updateInfos();
    } else {
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  private async getRoles(){
    return await this.userService.getUserRoles(this.infos._id).then(res => {
      if(res == 200){
        return res.roles
      }else{
        //todo snackbar
      }
    })
  }

  /*private updateInfos(){
    //console.log("clubid before", this.infos.user['clubId']);
    this.infos = this.tokenStorage.getUser();
    //this.infos.user['clubId'] = this.infos.clubId;
    console.log("clubid updateinfos after tokenstorage get user", this.infos.user['clubId']);
  }*/

}
