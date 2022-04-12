import {Component, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {map} from "rxjs/operators";
import {HorseService} from "../_services/horse.service";
import {MatSnackBar} from "@angular/material/snack-bar";


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

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private tokenStorage: TokenStorageService, private userService: UserService, private horseService: HorseService) { }

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

  private fetchData(){
    let clubId;

    if(this.isClub) {
      clubId = this.infos._id
    }else{
      clubId = this.infos.clubId
    }
    this.userService.getUsersByClub(clubId).pipe(map(responseData => {
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;
    })).subscribe(response=>{
      // @ts-ignore
      this.users = response;
      this.users.forEach((item,index)=>{
        if(item['_id'] === this.infos._id){
          this.users.splice(index, 1);
        }
      });
    });
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

    this.horseService.horseRegistration(form).subscribe(response=>{
      this.submitted = true;
      this.isSuccessful = true;
      let snackBarRef = this._snackBar.open("Registrazione con successo", "Ok", {
        duration: 3000
      });
      if(!this.isClub && !tmpRole.includes(role)){
        tmpRole.push(role);
        this.userService.addRole(role, form.ownerId).subscribe(resp=>{
          this.infos['roles'] = tmpRole;
          this.tokenStorage.saveUser(this.infos);
        }, error =>{
          console.log(error);
        })
      }
      snackBarRef.afterDismissed().subscribe(()=>{
        window.location.assign('/profile');
      })
    }, err => {
      this._snackBar.open("Non è stato possibile registrare il cavallo", "Ok", {
        duration: 3000
      });
      this.errorMessage = err.error.message;
      this.isRegistrationFailed = true;
      console.log(err);
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
}
