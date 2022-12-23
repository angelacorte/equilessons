import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {LessonService} from "../_services/lesson.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";
import {AuthService} from "../_services/auth.service";
import {UserService} from "../_services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogUserViewComponent} from '../dialog-user-view/dialog-user-view.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClubInfos, UserInfos} from "../_utils/Person";

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit/*, AfterViewInit*/ {

  @ViewChild(MatTable, {static:false}) table!: MatTable<UserInfos>;
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

  users: UserInfos[] = [];
  dataSource = new MatTableDataSource(this.users);
  isLoggedIn = false;
  infos?: ClubInfos;
  toRemove: string[] = [];
  displayedColumns = ['checkbox', 'user', 'telephone_number', 'temporary_user'];

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar, private userService: UserService,
              private authService: AuthService, private http: HttpClient, private lessonService: LessonService,
              private tokenStorage: TokenStorageService, private clubService: ClubService) { }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
      if(this.infos){
        await this.fetchUsers(this.infos._id);
      }else{
        this.openSnackbar("Qualcosa è andato storto, riprova");
      }
    } else {
      window.location.assign('/notAllowed');
    }
  }

  private async getAthletes(clubId:any):Promise<any>{
    return this.clubService.getClubAthletes(clubId).toPromise();
  }

  private async fetchUsers(clubId:string){
    this.getAthletes(clubId).then((response:any)=>{
      response.forEach((value:UserInfos) => {
        if(value.email === undefined){
          value.temporary = true;
          this.users.push(value);
        }else{
          value.temporary = false;
          this.users.push(value);
        }
      })
      this.setDataSource(this.users);
    })
  }

  private async getUserById(userId:any):Promise<any>{
    return this.userService.getUserById(userId).toPromise();
  }

  private async getUserHorses(userId:any){
    return this.userService.getUserHorses(userId).toPromise();
  }

  async showInfos(userId: any) {
    await this.getUserById(userId).then(async (response: any) => {
      if (response.horse.length > 0) {
        await this.getUserHorses(userId).then((resp:any)=>{
          response.horse = resp[0].horses_infos;
          this.dialog.open(DialogUserViewComponent, {
            width: '600px',
            data: response
          });
        })
      }else {
        this.dialog.open(DialogUserViewComponent, {
          width: '600px',
          data: response
        });
      }
    })
  }

  isUserUnchecked(e: any, userId: string) {
    if(!e.target.checked) {
      this.users.some((value:UserInfos, index:number)=> {
        if(value._id === userId && value.email === undefined){
          this.users.splice(index,1)
          this.toRemove.push(userId);
          this.setDataSource(this.users);
          this.dataSource.data = this.users;
        }
      })
    }
  }

  update() {
    if(this.toRemove.length > 0){
      this.userService.removeUser(this.toRemove).subscribe(resp =>{
        this.openSnackbar("Operazione avvenuta con successo");

      }, err => {
        this.openSnackbar("Qualcosa è andato storto");
        console.log('ERROR SHOW USERS', err);
      })
    }
  }

  onSubmit() {
    if(this.infos){
      let tmpUser = this.form;
      tmpUser.clubId = this.infos._id;

      this.authService.signup(tmpUser).subscribe(
        data => {
          this.openSnackbar("Registrazione avvenuta con successo");
        },
        err => {
          this.openSnackbar("Non è stato possibile registare l'utente");
          console.log('ERROR', err);
        }
      );
    }else{
      this.openSnackbar("Qualcosa è andato storto, riprova");
    }
  }

  private openSnackbar(message:string){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      window.location.reload();
    })
  }
  private setDataSource(data:UserInfos[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }
}
