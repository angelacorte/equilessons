import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClubService} from "../_services/club.service";
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {UserInfos} from "../_utils/Person";

@Component({
  selector: 'app-personal-infos',
  templateUrl: './personal-infos.component.html',
  styleUrls: ['./personal-infos.component.css']
})
export class PersonalInfosComponent implements OnInit {

  form: any = {
    name: "",
    surname: "",
    email: "",
    birthday: "",
    username: "",
    phoneNumber: "",
    taxcode: "",
    city: "",
    address: "",
    nrFise: "",
    clubId: "",
  };
  clubs: {_id: string, clubName: string}[] = [];
  isClub: boolean = false
  infos!: UserInfos;

  constructor(private _snackBar: MatSnackBar, private clubService: ClubService, private tokenStorage: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    if(!!this.tokenStorage.getToken()){
      this.isClub = this.tokenStorage.isClub();
      if(!this.isClub) {
        this.infos = this.tokenStorage.getUser()
        this.form = this.infos
      }
      this.fetchData()
    }else{
      window.location.assign('notAllowed')
    }

  }

  private fetchData(){
    this.clubService.getAllClubs().then(res => {
      if (res.status == 200) {
        this.clubs = res.clubs;
      } else {
        this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RETRY)
      }
    })
  }

  private openSnackbar(message: string, option: SnackBarActions) {
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=> {
      switch (option) {
        case SnackBarActions.REFRESH:
          this.infos = this.tokenStorage.getUser();
          this.form = this.infos
          break;
        case SnackBarActions.RELOAD || SnackBarActions.RETRY:
          window.location.reload();
      }
    })
  }

  onSubmit() {
    let updateUser = this.form
    updateUser._id = this.infos._id
    this.userService.updateUser(updateUser).then(r => {
      switch (r.status) {
        case 200:
          this.tokenStorage.saveUser(updateUser)
          this.openSnackbar(SnackBarMessages.SUCCESS, SnackBarActions.REFRESH);
          break;
        case 500:
          this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RELOAD);
          break;
        case 400:
          this.openSnackbar(SnackBarMessages.NOT_POSSIBLE, SnackBarActions.RETRY);
          break;
      }
    })
  }
}
