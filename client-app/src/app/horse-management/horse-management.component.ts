import {Component, OnInit, ViewChild} from '@angular/core';
import {HorseService} from "../_services/horse.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {DialogHorseViewComponent} from "../dialog-horse-view/dialog-horse-view.component";
import {HorseInfos} from "../_utils/Horse";
import {UserService} from "../_services/user.service";
import {ClubInfos, UserInfos} from "../_utils/Person";
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";

@Component({
  selector: 'app-horse-management',
  templateUrl: './horse-management.component.html',
  styleUrls: ['./horse-management.component.css']
})
export class HorseManagementComponent implements OnInit {

  @ViewChild(MatTable, {static:false}) table!: MatTable<any>;
  @ViewChild(MatSort, {static:false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;

  horses:HorseInfos[] = [];
  displayedColumns = ['checkbox', 'cavallo', 'proprietario', 'scuola'];
  dataSource = new MatTableDataSource(this.horses);
  toRemove:string[] = [];
  isClub: boolean = false;
  infos!: ClubInfos | UserInfos;
  isLoggedIn:boolean = false;

  constructor(private userService:UserService, public dialog: MatDialog, private _snackBar: MatSnackBar, private horseService: HorseService, private tokenStorage: TokenStorageService) { }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if(this.isLoggedIn){
      this.isClub = this.tokenStorage.isClub();
      if(this.isClub){
        this.infos = this.tokenStorage.getInfos(this.isClub); //get the infos saved in the session
        this.horses = await this.getAllHorses(this.infos['_id']);
        await this.matchOwner();
        this.setDataSource(this.horses);
      }else{
        this.infos = this.tokenStorage.getInfos(this.isClub);
        this.displayedColumns = ['checkbox','cavallo', 'scuola'];
        this.horses = await this.getPrivateHorses(this.infos['_id']);
        await this.matchPrivateHorse();
        this.setDataSource(this.horses);
      }
    }else {
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  private async getAllHorses(clubId:string):Promise<any>{
    return await this.horseService.getAllHorses(clubId);
  }

  private async getPrivateHorses(userId: string): Promise<any>{
    return await this.horseService.getPrivateHorses(userId);
  }

  isHorseUnchecked(e: any, horseId: any) {
    if(!e.target.checked){
      this.horses.some((value:any,index:number) => {
        if(value._id === horseId && value.scholastic){
          this.horses.splice(index,1);
          this.toRemove.push(horseId);
          this.setDataSource(this.horses);
        }
      })
    }
  }

  async showHorseInfos(horseId: string) {
    await this.horseService.getHorse(horseId).then(async (response: any) => {
      if(response.status == 200){
        this.dialog.open(DialogHorseViewComponent, {
          width: '600px',
          data: response.horse
       })
      }
    });
  }

  update() {
    this.horseService.removeHorses(this.toRemove).then((res) => {
      if(res.status == 200){
        this.openSnackbar(SnackBarMessages.SUCCESS, SnackBarActions.REFRESH);
      }else{
        this.openSnackbar(SnackBarMessages.PROBLEM, SnackBarActions.RETRY);
      }
    })
  }

  private setDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }

  private openSnackbar(message:string, option: SnackBarActions){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      switch (option) {
        case SnackBarActions.REFRESH:
          this.setDataSource(this.horses)
          break;
      }
    })
  }

  private async matchOwner(){
    this.horses.forEach((value:any, index) =>{
      let val = value['horseOwner'][0];
      if(value['horseOwner'].length > 0){
        this.horses[index]['horseOwner'] = {
          ownerId: val['_id'],
          ownerName: val['name'],
          ownerSurname: val['surname']
        };
      }
      if(value['clubOwner'].length > 0){
        val = value['clubOwner'][0];
        this.horses[index]['horseOwner'] = {
          ownerId: val['_id'],
          ownerName: val['clubName'],
          ownerSurname: ''
        };
      }
    })
  }

  private async matchPrivateHorse() { //TODO add way to remove horse
    this.horses.forEach((h:HorseInfos, index) => {
      if(!this.isClub){
        this.horses[index]['horseOwner'] = {
        // @ts-ignore
          ownerName: this.infos['name'],
        // @ts-ignore
          ownerSurname: this.infos['surname'],
          ownerId: this.infos['_id']
        };
      }
    })
  }

  isOwner(ownerId: string) {
    return this.infos._id == ownerId
  }
}
