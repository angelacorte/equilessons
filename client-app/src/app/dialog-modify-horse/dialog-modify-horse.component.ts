import {Component, Inject, OnInit} from '@angular/core';
import {RiderInfo, UserInfos} from "../_utils/Person";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClubService} from "../_services/club.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {HorseService} from "../_services/horse.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HorseInfos} from "../_utils/Horse";
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";
import {DialogHorseViewComponent} from "../dialog-horse-view/dialog-horse-view.component";

@Component({
  selector: 'app-dialog-modify-horse',
  templateUrl: './dialog-modify-horse.component.html',
  styleUrls: ['./dialog-modify-horse.component.css']
})
export class DialogModifyHorseComponent implements OnInit {
  form:any = {
    horseName:"",
    horseMicrochip:"",
    ownerId:"",
    clubId:"",
    horseFise:"",
    horseBirthday:"",
    riders:[],
    scholastic:false
  }
  isLoggedIn = false;
  infos: any;
  users: UserInfos[] = [];
  riders: RiderInfo[] = [];
  riderId!: string;
  isClub: boolean = false;
  updateUser: string[] = []
  removeUser: string[] = []

  constructor(@Inject(MAT_DIALOG_DATA) public data: HorseInfos,
              private _snackBar: MatSnackBar,
              private clubService: ClubService,
              private tokenStorage: TokenStorageService,
              private userService: UserService,
              private horseService: HorseService,
              public dialogRef: MatDialogRef<DialogHorseViewComponent>,
              public dialog: MatDialog) { }
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn) {
      this.form = this.data
      this.isClub = this.tokenStorage.isClub();
      this.infos = this.tokenStorage.getInfos(this.isClub);
      this.form.ownerId = this.infos._id;

      this.fetchData();
    }else {
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  private async fetchData() {
    let clubId;
    if (this.isClub) {
      clubId = this.infos._id
    } else {
      clubId = this.infos.clubId
    }
    this.users = await this.getUsers(clubId);
    this.users.forEach((item, index) => {
      if (item['_id'] === this.infos._id || item['email'] == undefined) {
        this.users.splice(index, 1);
      }
    });
    if(this.data.riders.length > 0){
      this.data.riders.forEach((riderId) => {
        this.userService.getUserById(riderId).then((res) => {
          if(res.status == 200){
            let rider: RiderInfo = {
              riderId: res.user._id,
              riderName: res.user.name,
              riderSurname: res.user.surname
            }
            this.riders.push(rider)
          }else{
            this.openSnackbar(SnackBarMessages.NOT_POSSIBLE, SnackBarActions.RELOAD)
          }
        })
      })
    }
  }

  private async getUsers(clubId: any): Promise<any>{
    return await this.clubService.getClubAthletes(clubId);
  }

  onSubmit() {
    let updateHorse = this.form
    updateHorse.horseBirthday = new Date(this.form.horseBirthday)
    this.horseService.updateHorse(updateHorse).then(res => {
      if(this.updateUser.length > 0){
        this.updateUser.forEach(async userId => {
          await this.userService.addUserHorse(userId, updateHorse._id).then(r => {
            if(r.status != 200){
              this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RELOAD);
            }
          })
        })
      }
      if(this.removeUser.length > 0){
        this.removeUser.forEach(async userId => {
          await this.userService.removeUserHorse(userId, updateHorse._id).then(r => {
            if(r.status != 200){
              this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RELOAD);
            }
          })
        })
      }
      switch (res.status){
        case 200:
          this.openSnackbar(SnackBarMessages.SUCCESS, SnackBarActions.REFRESH, updateHorse);
          break;
        case 400:
          this.openSnackbar(SnackBarMessages.NOT_POSSIBLE, SnackBarActions.RETRY);
          break;
        case 500:
          this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RELOAD);
          break;
      }
    })
  }

  addRiderToList(riderId: string) {
    if(this.infos['_id'] === riderId){
      let newRider: RiderInfo = {
        riderId: riderId,
        riderName: this.infos['name'],
        riderSurname: this.infos['surname']
      }
      this.riders.push(newRider);
      this.form.riders.push(riderId)
      this.updateUser.push(riderId)
    }else{
      this.users.forEach((value) => {
        if(value['_id'] === riderId && !this.riders.some(obj=>obj['riderId'] === riderId)){
          let newRider: RiderInfo = {
            riderId: riderId,
            riderName: value['name'],
            riderSurname: value['surname']
          }
          this.riders.push(newRider);
          this.form.riders.push(riderId)
          this.updateUser.push(riderId)
        }
      });
    }
  }

  isInList(id: string):boolean {
    return this.riders.some(obj=>obj['riderId'] === id);
  }

  isRiderUnchecked(riderId: string) {
    this.riders = this.riders.filter(r => r.riderId !== riderId)
    this.form.riders = this.form.riders.filter((r: string) => r !== riderId)
    this.removeUser.push(riderId)
  }

  isScholasticChecked(){
    this.form.scholastic = !this.form.scholastic;
  }

  private openSnackbar(message: string, option: SnackBarActions, data?: HorseInfos) {
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=> {
      switch (option) {
        case SnackBarActions.REFRESH:
          this.onClose();
          break;
        case SnackBarActions.RELOAD || SnackBarActions.RETRY:
          window.location.reload();
      }
    })
  }

  onClose(){
    this.dialogRef.close();
  }
}
