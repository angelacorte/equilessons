import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {LessonService} from "../_services/lesson.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";
import {map} from "rxjs/operators";
import {AuthService} from "../_services/auth.service";
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit {

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<any>;

  form:any = {
    userId:''
  };

  users:any = [];
  errorMessage = '';
  isLoggedIn = false;
  infos: any;
  toRemove: any = [];
  displayedColumns = ['checkbox', 'utente', 'numero_di_telefono', 'utente_temporaneo'];

  constructor(private userService: UserService, private authService: AuthService, private http: HttpClient, private lessonService: LessonService, private tokenStorage: TokenStorageService, private clubService: ClubService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
      this.fetchData();
    }else{
      window.location.assign('/notAllowed');
    }
  }

  private fetchData() {
    this.clubService.getClubAthletes(this.infos._id).pipe(map(responseData =>{
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;
    })).subscribe(response=>{
      response.forEach(value => {
        let u = {
          userId: value._id,
          name: value.name,
          surname: value.surname,
          email: value.email,
          phoneNumber: value.phoneNumber,
          tmp: ''
        }
        if(value.email === undefined){
          u.tmp = "<mat-icon>done</mat-icon>";
          this.users.push(u)
        }else{
          this.users.push(u);
        }
      })
      console.log("users", this.users);
    });
  }

  showInfos(userId: any) {
    console.log("TO IMPLEMENT")
  }

  isUserUnchecked(e: any, userId: any) {
    if(!e.target.checked) {
      // @ts-ignore
      this.users.some((value, index)=> {
        if(value.userId === userId && value.email === undefined){
          this.users.splice(index,1)
          this.toRemove.push(userId);
          this.table.renderRows();
        }
      })
    }
  }

  update() {
    if(this.toRemove.length > 0){
      this.userService.removeUser(this.toRemove).subscribe(resp =>{
        window.location.reload();
      }, err => {
        this.errorMessage = err.error.message;
        console.log(err);
      })
    }
  }

  isUserTmp(userId: any):boolean {
    // @ts-ignore
    return this.users.some(obj=>obj.userId === userId && obj.tmp !== '');
  }

  onSubmit() {
    let tmpUser = this.form;
    tmpUser.clubId = this.infos._id;

    this.authService.signup(tmpUser).subscribe(
      data => {
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }

  reloadPage(): void {
    window.location.assign('/showUsers');
  }
}
