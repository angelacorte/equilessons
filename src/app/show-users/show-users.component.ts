import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {LessonService} from "../_services/lesson.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";
import {map} from "rxjs/operators";
import {AuthService} from "../_services/auth.service";
import {UserService} from "../_services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogUserViewComponent} from '../dialog-user-view/dialog-user-view.component';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit/*, AfterViewInit*/ {

  @ViewChild(MatTable, {static:false}) table!: MatTable<any>;
  @ViewChild(MatSort, {static:false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;

  form:any = {
    userId:''
  };

  users:any = [];
  errorMessage = '';
  isLoggedIn = false;
  infos: any;
  toRemove: any = [];
  displayedColumns = ['checkbox', 'utente', 'numero_di_telefono', 'utente_temporaneo'];
  dataSource:any;

  constructor(public dialog: MatDialog, private userService: UserService, private authService: AuthService, private http: HttpClient, private lessonService: LessonService, private tokenStorage: TokenStorageService, private clubService: ClubService) { }

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
          tmp: false
        }
        if(value.email === undefined){
          u.tmp = true;
          this.users.push(u)
        }else{
          this.users.push(u);
        }
      })
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.data = this.users;
      this.dataSource.sort;
      this.dataSource.paginator = this.paginator;
      console.log("this.users", this.users);
    });
  }

  showInfos(userId: any) {
    this.userService.getUserById(userId).pipe(map(responseData =>{
      return responseData;
    })).subscribe(response=>{
      if(response.horse.length > 0){
        this.userService.getUserHorses(response._id).pipe(map(respData =>{
          return respData;
        })).subscribe(resp=>{
          response.horse = resp[0].horses_infos;
          let dialogRef = this.dialog.open(DialogUserViewComponent, {
            width: '600px',
            data: response
          });
        })
      } else{
        let dialogRef = this.dialog.open(DialogUserViewComponent, {
          width: '600px',
          data: response
        });
      }

    });
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

  openDialog(userId: any) {

  }

/*  ngAfterViewInit(): void {
    console.log("ngAfterContentInit this.users", this.users);
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }*/

}
