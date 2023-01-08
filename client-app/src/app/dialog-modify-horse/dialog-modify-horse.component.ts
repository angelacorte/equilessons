import {Component, Inject, OnInit} from '@angular/core';
import {RiderInfo, UserInfos} from "../_utils/Person";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClubService} from "../_services/club.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {HorseService} from "../_services/horse.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {HorseInfos} from "../_utils/Horse";

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
  isOwnRider: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: HorseInfos, private _snackBar: MatSnackBar, private clubService: ClubService,  private tokenStorage: TokenStorageService, private userService: UserService, private horseService: HorseService) { }
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
  }

  private async getUsers(clubId: any): Promise<any>{
    return await this.clubService.getClubAthletes(clubId);
  }

  onSubmit() {
    console.log("form ", this.form)
    this.form.riders = this.riders
    return false;
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
  }

  isInList(id: string):boolean {
    return this.riders.some(obj=>obj['riderId'] === id);
  }

  isRiderUnchecked(rider: any) {
    if(rider._id === this.infos._id) this.isOwnRider = false;
    this.removeDoc(rider);
  }

  isScholasticChecked(){
    this.form.scholastic = !this.form.scholastic;
  }

  private removeDoc(doc: any){
    this.riders.forEach((item,index)=>{
      if(item['riderId'] === doc['_id']){
        this.riders.splice(index, 1);
      }
    });
  }
}
