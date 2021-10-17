import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {LessonService} from "../_services/lesson.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ClubService} from "../_services/club.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

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

  dataSource:any;
  errorMessage = '';
  isLoggedIn = false;
  infos: any;
  displayedColumns = ['checkbox', 'istruttore'];
  coaches:{_id: any, name: any, surname: any}[]= [];
  coachId: any;
  users = [];
  toUpdate: {coachId: any}[]= [];

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private lessonService: LessonService, private tokenStorage: TokenStorageService, private clubService: ClubService) { }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());

      await this.getCoaches(this.infos._id).then((response)=>{
        this.coaches = response[0]['clubCoaches'];
      });

      this.users = await this.getAthletes(this.infos._id);

      this.setDataSource(this.coaches);
    } else {
      window.location.assign('/notAllowed');
    }
  }

  async onSubmit() {
    this.coaches.forEach((value) => {
      this.toUpdate.push(value._id);
    })

    await this.addCoach(this.toUpdate, this.infos._id).then((response:any)=>{
      if(response.ok === 1){
        this.openSnackbar("Operazione effettuata con successo");
      }else{
        console.log(response);
        this.openSnackbar("Errore nell'aggiornamento degli istruttori");
      }
    });
  }

  isUserInList(id: any):boolean {
    return this.coaches.some((obj)=>obj["_id"] === id);
  }

  addCoachToList(coachId: any) {
    this.users.forEach((value => {
      if(value['_id'] === coachId && !this.coaches.some(obj=>obj['_id'] === coachId)){
        let coach = {
          _id: value['_id'],
          name: value['name'],
          surname: value['surname']
        };
        this.coaches.push(coach);
        this.form.coachId = '';
        this.setDataSource(this.coaches);
        this.table.renderRows();
      }
    }))
  }

  private async getCoaches(clubId:any): Promise<any>{
    return this.clubService.getClubCoaches(clubId).toPromise();
  }

  private async getAthletes(clubId:any):Promise<any>{
    return this.clubService.getClubAthletes(clubId).toPromise();
  }

  private async addCoach(update:any, clubId:any):Promise<any>{
    return this.clubService.addCoach(update, clubId).toPromise()
  }

  isCoachUnchecked(e: any, coachId:any) {
    if(!e.target.checked){
      this.coaches.forEach((item,index)=>{
        if(this.coaches[index] === coachId){
          this.coaches.splice(index, 1);
          this.setDataSource(this.coaches);
          this.table.renderRows();
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
