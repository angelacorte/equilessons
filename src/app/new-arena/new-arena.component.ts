import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {ArenaService} from "../_services/arena.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatAccordion} from "@angular/material/expansion";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ClubInfos} from "../_utils/Person";
import {ArenaInfo} from "../_utils/Arena";

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

  form:ArenaInfo = {
    arenaName:'',
    clubId:''
  }

  arenas:ArenaInfo[] = [];
  dataSource = new MatTableDataSource(this.arenas);
  displayedColumns = ['checkbox', 'arenaName'];
  isLoggedIn = false;
  infos?: ClubInfos;
  toUpdate: ArenaInfo[] = [];
  toRemove: string[] = [];

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar,
              private arenaService: ArenaService) {
  }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
      if(this.infos){
        this.arenas = await this.getArenas(this.infos._id);
        this.setDataSource(this.arenas);
      }else{
        this.openSnackbar("Qualcosa è andato storto, riprova");
      }
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
          console.log('ERROR NEW ARENA 1', err);
          this.openSnackbar("Errore nella rimozione dei campi");
        })
      } else {
        this.openSnackbar("Modifiche apportate con successo");
      }
    }, err => {
      console.log('ERROR NEW ARENA 2', err);
      this.openSnackbar("Errore nella modifica dei campi");
    })
  }

  addArenaToList(value: string) {
    if(this.infos){
      let newArena: ArenaInfo = {
        clubId: this.infos._id,
        arenaName: value
      };
      this.arenas.push(newArena);
      this.toUpdate.push(newArena);
      this.setDataSource(this.arenas);
      this.dataSource.data = this.arenas;
    }else{
      this.openSnackbar("Qualcosa è andato storto, riprova");
    }
  }

  isArenaUnchecked(e: any, arenaId:string) {
    if(!e.target.checked){
      this.arenas.forEach((item, index)=>{
        if(item.arenaId === arenaId){
          this.arenas.splice(index, 1);
          this.toRemove.push(arenaId);
          this.setDataSource(this.arenas);
          this.dataSource.data = this.arenas;
        }
      });
    }
  }

  private async addArena(data:ArenaInfo[]):Promise<any>{
    return await this.arenaService.addArena(data).toPromise();
  }

  private async getArenas(clubId:string):Promise<any>{
    return this.arenaService.getClubArenas(clubId).toPromise();
  }

  private setDataSource(data:ArenaInfo[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }

  private openSnackbar(message:string){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      window.location.reload();
    })
  }
}
