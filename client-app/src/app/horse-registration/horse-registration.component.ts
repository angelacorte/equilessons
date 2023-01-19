import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {HorseService} from "../_services/horse.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClubService} from "../_services/club.service";
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";
import {RiderInfo, Roles, UserInfos} from "../_utils/Person";


@Component({
  selector: 'app-horse-registration',
  templateUrl: './horse-registration.component.html',
  styleUrls: ['./horse-registration.component.css']
})
export class HorseRegistrationComponent implements OnInit {

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
  isOwnRider: boolean = false;
  updateUser: string[] = []


  constructor(private _snackBar: MatSnackBar, private clubService: ClubService,  private tokenStorage: TokenStorageService, private userService: UserService, private horseService: HorseService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn) {
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
  }

  private async getUsers(clubId: any): Promise<any>{
    return await this.clubService.getClubAthletes(clubId);
  }

  onSubmit(): void{
    const form = {
      horseName:this.form.horseName,
      horseMicrochip: this.form.horseMicrochip,
      ownerId: this.form.ownerId,
      clubId: '',
      horseBirthday: this.form.horseBirthday,
      riders: this.form.riders,
      scholastic: this.form.scholastic,
      horseFise: this.form.horseFise
    }
    if(!this.isClub){
      form.clubId = this.infos.clubId;
    }else {
      form.clubId = this.infos._id;
      form.ownerId = this.infos._id;
      form.scholastic = true;
    }
    this.horseService.horseRegistration(form).then((response)=>{
      if(response.status == 200){
        if(this.updateUser.length > 0){
          this.updateUser.forEach(async userId => {
            await this.userService.addUserHorse(userId, response.horse._id).then(r => {
              if(r.status != 200){
                this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RELOAD);
              }
            })
          })
        }
        this.openSnackbar(SnackBarMessages.SUCCESS, SnackBarActions.ASSIGN);
      }else{
        this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.DO_NOTHING);
      }
    }, err => {
      this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.DO_NOTHING);
    })
  }

  isOwnerRider() {
    this.isOwnRider = !this.isOwnRider;
    if(this.isOwnRider){
      this.addRiderToList(this.infos['_id']);
    }else {
      this.removeRider(this.infos['_id']);
    }
  }

  addRiderToList(riderId: string) {
    if(this.infos['_id'] === riderId){
      let newRider: RiderInfo = {
        riderId: riderId,
        riderName: this.infos['name'],
        riderSurname: this.infos['surname']
      }
      this.riders.push(newRider);

    }else{
      this.users.forEach((value) => {
        if(value['_id'] === riderId && !this.riders.some(obj=>obj['riderId'] === riderId)){
          let newRider: RiderInfo = {
            riderId: riderId,
            riderName: value['name'],
            riderSurname: value['surname']
          }
          this.riders.push(newRider);
        }
      });
    }
    this.form.riders.push(riderId)
    this.updateUser.push(riderId)
  }

  isScholasticChecked(){
    this.form.scholastic = !this.form.scholastic;
  }

  removeRider(id: string){
    if(id === this.infos._id) this.isOwnRider = false
    this.riders = this.riders.filter(r => r.riderId !== id)
    this.form.riders = this.form.riders.filter((r: string) => r !== id)
    this.updateUser = this.updateUser.filter(r => r !== id)
  }

  isInList(id: string):boolean {
    return this.riders.some(obj=>obj['riderId'] === id);
  }

  private openSnackbar(message:string, option: SnackBarActions){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      switch (option) {
        case SnackBarActions.ASSIGN:
          window.location.assign('/profile');
          break;
      }
    })
  }
}
