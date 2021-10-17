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

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar, private userService: UserService,
              private authService: AuthService, private http: HttpClient, private lessonService: LessonService,
              private tokenStorage: TokenStorageService, private clubService: ClubService) { }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
      await this.fetchUsers(this.infos._id);
    } else {
      window.location.assign('/notAllowed');
    }
  }

  private async getAthletes(clubId:any):Promise<any>{
    return this.clubService.getClubAthletes(clubId).toPromise();
  }

  private async fetchUsers(clubId:any){
    this.getAthletes(clubId).then((response:any)=>{
      response.forEach((value:any) => {
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

  isUserUnchecked(e: any, userId: any) {
    if(!e.target.checked) {
      this.users.some((value:any, index:number)=> {
        if(value.userId === userId && value.email === undefined){
          this.users.splice(index,1)
          this.toRemove.push(userId);
          this.setDataSource(this.users);
          this.table.renderRows();
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
        console.log(err);
      })
    }
  }

  onSubmit() {
    let tmpUser = this.form;
    tmpUser.clubId = this.infos._id;

    this.authService.signup(tmpUser).subscribe(
      data => {
        this.openSnackbar("Registrazione avvenuta con successo");
      },
      err => {
        this.openSnackbar("Non è stato possibile registare l'utente");
        console.log(err);
      }
    );
  }

  private openSnackbar(message:any){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      window.location.reload();
    })
  }
  private setDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }
}
