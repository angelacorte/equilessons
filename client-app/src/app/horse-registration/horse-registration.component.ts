import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {HorseService} from "../_services/horse.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClubService} from "../_services/club.service";
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";


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

  isSuccessful = false;
  isRegistrationFailed = false;
  errorMessage = '';
  submitted = false;
  isLoggedIn = false;
  infos: any;
  users = [];
  riders = [];
  riderId: any;
  isClub: boolean = false;
  isOwnRider: boolean = false;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private clubService: ClubService,  private tokenStorage: TokenStorageService, private userService: UserService, private horseService: HorseService) { }

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

    const role = 'horse-owner';
    let tmpRole: any;
    if(!this.isClub) tmpRole = this.infos['roles'];

    const form = {
      horseName:this.form.horseName,
      horseMicrochip: this.form.horseMicrochip,
      ownerId: this.form.ownerId,
      clubId: '',
      horseBirthday: this.form.horseBirthday,
      riders: this.riders,
      scholastic: this.form.scholastic
    }
    if(!this.isClub){
      form.clubId = this.infos.clubId;
    }else {
      form.clubId = this.infos._id;
      form.ownerId = this.infos._id;
      form.scholastic = true;
    }

    this.horseService.horseRegistration(form).subscribe((response)=>{
      if(response.status == 200){
        if(!this.isClub && !tmpRole.includes(role)){
          tmpRole.push(role);
          this.userService.addRole(role, form.ownerId).subscribe(resp=>{
            this.infos['roles'] = tmpRole;
            this.tokenStorage.saveUser(this.infos);
          }, error =>{
            console.log("ERROR HORSE REG", error);
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
      let val = {
        _id: this.infos['_id'],
        name: this.infos['name'],
        surname: this.infos['surname']
      }
      this.removeDoc(val);
    }
  }

  addRiderToList(riderId: any) {
    if(this.infos['_id'] === riderId){
      let val = {
        _id: riderId,
        name: this.infos['name'],
        surname: this.infos['surname']
      }
      // @ts-ignore
      this.riders.push(val);
    }
    this.users.forEach((value) => {
      if(value['_id'] === riderId && !this.riders.some(obj=>obj['_id'] === riderId)){
        this.riders.push(value);
        console.log("riders ", this.riders);
      }
    });
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
      if(item['_id'] === doc['_id']){
        this.riders.splice(index, 1);
      }
    });
  }

  isInList(id: any):boolean {
    return this.riders.some(obj=>obj['_id'] === id);
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
