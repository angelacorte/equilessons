import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {LessonService} from "../_services/lesson.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ClubInfos, Coach, UserInfos} from "../_utils/Person";
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";

@Component({
  selector: 'app-add-coach',
  templateUrl: './add-coach.component.html',
  styleUrls: ['./add-coach.component.css']
})
export class AddCoachComponent implements OnInit {

  @ViewChild(MatTable, {static:false}) table!: MatTable<any>;
  @ViewChild(MatSort, {static:false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;

  form:any = {
    coachId: ''
  }

  coaches:Coach[]= [];
  dataSource = new MatTableDataSource(this.coaches);
  isLoggedIn = false;
  infos!: ClubInfos;
  displayedColumns = ['checkbox', 'istruttore'];
  coachId: string = "";
  users: UserInfos[] = [];
  toUpdate: string[]= [];

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private lessonService: LessonService, private tokenStorage: TokenStorageService, private clubService: ClubService) { }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
      if(this.infos){
        this.coaches = await this.getCoaches(this.infos._id);
        this.users = await this.getAthletes(this.infos._id);
        this.setDataSource(this.coaches);
      }else{ this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RELOAD); }
    } else {
      window.location.assign('/notAllowed');
    }
  }

  async onSubmit() {
    this.coaches.forEach((value) => {
      this.toUpdate.push(value._id);
    })
    if (this.infos) {
      this.clubService.addCoach(this.toUpdate, this.infos._id).then((res) => {
        if (res.status == 200) {
          this.openSnackbar(SnackBarMessages.SUCCESS, SnackBarActions.REFRESH);
        } else {
          this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RETRY);
        }
      })
    } else { this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RETRY); }
  }

  isUserInList(id: any):boolean {
    return this.coaches.some((obj)=>obj["_id"] === id);
  }

  addCoachToList(coachId: string) {
    this.users.forEach((value => {
      if(value['_id'] === coachId && !this.coaches.some(obj=>obj['_id'] === coachId)){
        let coach: Coach = {
          _id: value['_id'],
          name: value['name'],
          surname: value['surname']
        };
        this.coaches.push(coach);
        this.form.coachId = '';
        this.setDataSource(this.coaches);
        this.dataSource.data = this.coaches;
      }
    }))
  }

  private async getCoaches(clubId:string): Promise<any>{ //todo maybe find a nicer way to do it? don't know
    return await this.clubService.getClubCoaches(clubId).then((res) => {
      if(res.status == 200){
        return res.coaches
      }else{
        //todo
      }
    });
  }

  private async getAthletes(clubId:string):Promise<any>{
    return this.clubService.getClubAthletes(clubId)
  }

  isCoachUnchecked(e: any, coachId:string) {
    if(!e.target.checked){
      this.coaches.forEach((item,index)=>{
        if(item._id === coachId){
          this.coaches.splice(index, 1);
          this.setDataSource(this.coaches);
          this.dataSource.data = this.coaches;
        }
      });
    }
  }

  private openSnackbar(message:string, option: SnackBarActions){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      switch (option) {
        case SnackBarActions.REFRESH:
          this.setDataSource(this.coaches)
          break;
        case SnackBarActions.RETRY:
          break;
        case SnackBarActions.RELOAD:
          window.location.reload();
          break;
      }
    })
  }

  private setDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }
}
