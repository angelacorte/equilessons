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
      }else{ this.openSnackbar("Qualcosa è andato storto, riprova."); }
    } else {
      window.location.assign('/notAllowed');
    }
  }

  async onSubmit() {
    this.coaches.forEach((value) => {
      this.toUpdate.push(value._id);
    })
    if (this.infos) {
      await this.addCoach(this.toUpdate, this.infos._id).then((response: any) => {
        if (response.ok === 1) {
          this.openSnackbar("Operazione effettuata con successo");
        } else {
          this.openSnackbar("Errore nell'aggiornamento degli istruttori");
        }
      });
    } else { this.openSnackbar("Qualcosa è andato storto, riprova."); }
  }

  isUserInList(id: any):boolean {
    return this.coaches.some((obj)=>obj["_id"] === id);
  }

  addCoachToList(coachId: string) {
    console.log("add coach to list")
    this.users.forEach((value => {
    console.log("value ", value)
      if(value['_id'] === coachId && !this.coaches.some(obj=>obj['_id'] === coachId)){
        let coach: Coach = {
          _id: value['_id'],
          name: value['name'],
          surname: value['surname']
        };
        console.log("coach ", coach)
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

  private async addCoach(update:string[], clubId:string):Promise<any>{
    return this.clubService.addCoach(update, clubId).toPromise()
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
