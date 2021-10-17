import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {ArenaService} from "../_services/arena.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatAccordion} from "@angular/material/expansion";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-new-arena',
  templateUrl: './new-arena.component.html',
  styleUrls: ['./new-arena.component.css']
})
export class NewArenaComponent implements OnInit {

  @ViewChild(MatTable, {static:false}) table!: MatTable<any>;
  @ViewChild(MatSort, {static:false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  form:any = {
    arenaName:'',
    clubId: ""
  }

  dataSource:any;
  displayedColumns = ['checkbox', 'arenaName'];
  isLoggedIn = false;
  infos: any;
  arenas:any[] = [];
  toUpdate: {clubId:any, arenaName:string}[] = [];
  toRemove: {arenaId: any}[] = [];

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar,
              private arenaService: ArenaService) {
  }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());

      this.arenas = await this.getArenas(this.infos._id);

      this.setDataSource(this.arenas);
    } else {
      window.location.assign('/notAllowed');
    }
  }

  async onSubmit(): Promise<void> {
    await this.addArena(this.toUpdate).then(()=> {
      if (this.toRemove.length > 0) {
        this.arenaService.removeArena(this.toRemove).subscribe(() => {
          this.openSnackbar("Modifiche apportate con successo");
        }, err => {
          console.log(err);
          this.openSnackbar("Errore nella rimozione dei campi");
        })
      } else {
        this.openSnackbar("Modifiche apportate con successo");
      }
    }, err => {
      console.log(err);
      this.openSnackbar("Errore nella modifica dei campi");
    })
  }

  addArenaToList(value: string) {
    let arena = {
      _id: '',
      arenaName: value
    };
    this.arenas.push(arena);
    let up = {
      clubId: this.infos._id,
      arenaName: arena.arenaName
    }
    this.toUpdate.push(up);
    this.setDataSource(this.arenas);
    this.table.renderRows();
  }

  isArenaUnchecked(e: any, arenaId:any) {
    if(!e.target.checked){
      this.arenas.forEach((item, index)=>{
        if(this.arenas[index] === arenaId){
          this.arenas.splice(index, 1);
          this.toRemove.push(arenaId);
          this.setDataSource(this.arenas);
          this.table.renderRows();
          console.log("this.arenas", this.arenas)
        }
      });
    }
  }

  private async addArena(data:any):Promise<any>{
    return await this.arenaService.addArena(data).toPromise();
  }

  private async getArenas(clubId:any):Promise<any>{
    return this.arenaService.getClubArenas(clubId).toPromise();
  }

  private setDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }

  private openSnackbar(message:any){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      window.location.reload();
    })
  }
}
