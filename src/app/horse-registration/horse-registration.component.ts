import {Component, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ClubService} from "../_services/club.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {map} from "rxjs/operators";
import {HorseService} from "../_services/horse.service";

const baseURL = 'http://localhost:5050';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

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
  mainId: any;
  isClub: boolean = false;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private userService: UserService, private horseService: HorseService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn) {
      this.isClub = this.tokenStorage.isClub();
      this.infos = this.tokenStorage.getInfos(this.isClub);
      this.form.ownerId = this.infos._id;
      this.fetchData();
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

    //TODO modificare circa tutto credo
    const role = 'horse-owner';
    let tmpRole = this.infos.user['roles'];
    const form = {
      horseName:this.form.horseName,
      horseMicrochip: this.form.horseMicrochip,
      ownerId: this.form.ownerId,
      clubId: this.infos.user['clubId'],
      horseBirthday: this.form.horseBirthday,
      riders: this.riders,
      scholastic: this.form.scholastic
    }

    this.horseService.horseRegistration(form).subscribe(response=>{
      this.submitted = true;
      this.isSuccessful = true;
      if(!tmpRole.includes(role)){
        tmpRole.push(role);
        this.userService.addRole(role, form.ownerId).subscribe(resp=>{
          this.infos.user['roles'] = tmpRole;
          this.tokenStorage.saveUser(this.infos);
        }, error =>{
          console.log(error);
        })
      }
    }, err => {
      this.errorMessage = err.error.message;
      this.isRegistrationFailed = true;
      console.log(err);
    })
  }

  isOwnerRider(e: any) {
    let rider = {
      _id: this.infos.user['_id'],
      name: this.infos.user['name'],
      surname: this.infos.user['surname'],
    }
    if(e.target.checked){ // && !this.riders.some(obj=>obj['_id'] === rider['_id'])
      // @ts-ignore
      this.riders.push(rider);
    }else{
      this.removeDoc(rider);
    }
  }

  addRiderToList(riderId: any) {
    this.users.forEach((value) => {
      if(value['_id'] === riderId && !this.riders.some(obj=>obj['_id'] === riderId)){
        this.riders.push(value);
      }
    })
  }

  isRiderUnchecked(e: any, rider: any) {
    if(!e.target.checked){
      this.removeDoc(rider);
    }
  }

  isClubOwnerChecked(e: any) {
    if(e.target.checked){
      this.form.ownerId = this.infos.user['clubId'];
    }else{
      this.form.ownerId = this.infos.user['_id'];
    }
  }

  isScholasticChecked(e: any){
    this.form.scholastic = e.target.checked;
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
