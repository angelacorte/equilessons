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
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";

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
        this.arenas = await this.getArenas(this.infos._id)
        this.setDataSource(this.arenas);
      }else{
        this.openSnackbar(SnackBarMessages.RETRY, SnackBarActions.RELOAD);
      }
    } else {
      window.location.assign('/notAllowed');
    }
  }

  async onSubmit(): Promise<void> {
    await this.addArena(this.toUpdate).then((res)=> {
      console.log("add arena res ", res)
      if(res.status == 200){
        this.replaceArena(res.newArenas)
        if(this.toRemove.length > 0){

        }else{
          this.openSnackbar(SnackBarMessages.OK, SnackBarActions.REFRESH);
        }
      }else{
        this.openSnackbar(SnackBarMessages.RETRY, SnackBarActions.RETRY);
      }

      // if (this.toRemove.length > 0) {
      //   this.arenaService.removeArena(this.toRemove).subscribe(() => {
      //     this.openSnackbar("Modifiche apportate con successo");
      //   }, err => {
      //     console.log('ERROR NEW ARENA 1', err);
      //     this.openSnackbar("Errore nella rimozione dei campi");
      //   })
      // } else {
      //   this.openSnackbar("Modifiche apportate con successo");
      // }
    }, err => {
      console.log('ERROR NEW ARENA 2', err);
      this.openSnackbar(SnackBarMessages.RETRY, SnackBarActions.RETRY);
    })
  }

  private replaceArena(arenas: {arenaName: string, clubId: string, arenaId: string}[]){
    console.log("replace ", arenas)
    arenas.forEach((arena) => {
      this.arenas.forEach((element, index) => {
        if(element.arenaName == arena.arenaName){
          this.arenas.splice(index,1);
          this.arenas.push(arena);
        }
      })
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
      this.openSnackbar(SnackBarMessages.RETRY, SnackBarActions.RETRY);
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

  private async getArenas(clubId:string):Promise<ArenaInfo[]>{
    return await this.arenaService.getClubArenas(clubId).toPromise().then(res => {
      if (res.status == 200) {
        return res.arenas;
      } else if (res.status == 400 || res.status == 500) {
        this.openSnackbar(SnackBarMessages.RETRY,SnackBarActions.RELOAD);
        return [];
      }
    });
  }

  private setDataSource(data:ArenaInfo[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }

  private openSnackbar(message:SnackBarMessages, option: SnackBarActions){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    if(option == SnackBarActions.RELOAD){
      snackBarRef.afterDismissed().subscribe(()=>{
        window.location.reload();
      })
    }else if(option == SnackBarActions.REFRESH){

    }else if(option == SnackBarActions.RETRY){

    }
  }
}
