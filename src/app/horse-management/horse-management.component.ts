import {Component, OnInit, ViewChild} from '@angular/core';
import {HorseService} from "../_services/horse.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  horses:any[] = [];
  displayedColumns = ['checkbox', 'cavallo', 'proprietario', 'scuola'];

  dataSource = new MatTableDataSource(this.horses);
  toRemove:any[] = [];
  isClub: boolean = false;
  infos:any;
  isLoggedIn:boolean = false;

  constructor(private _snackBar: MatSnackBar, private horseService: HorseService, private tokenStorage: TokenStorageService) { }

  async ngOnInit(): Promise<void> {
    this.isClub = this.tokenStorage.isClub();
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn && this.isClub) { //check on user's login
      this.infos = this.tokenStorage.getInfos(this.isClub); //get the infos saved in the session

      this.horses = await this.getAllHorses(this.infos['_id']);
      await this.matchOwner();
      this.setDataSource(this.horses);

    }else if(this.isLoggedIn && !this.isClub) {
      this.infos = this.tokenStorage.getInfos(this.isClub);
      this.displayedColumns = ['cavallo', 'scuola'];
      this.horses = await this.getPrivateHorses(this.infos['_id']);
      console.log("this horses" + this.horses)

      await this.matchPrivateHorse();
      this.setDataSource(this.horses);
    } else {
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  private async getAllHorses(clubId:any):Promise<any>{
    return await this.horseService.getAllHorses(clubId).toPromise();
  }

  private async getPrivateHorses(userId: string): Promise<any>{
    return await this.horseService.getPrivateHorses(userId).toPromise();
  }

  isHorseUnchecked(e: any, horseId: any) {
    if(!e.target.checked){
      this.horses.some((value:any,index:number) => {
        if(value._id === horseId && value.scholastic){
          this.horses.splice(index,1);
          this.toRemove.push(horseId);
          this.dataSource.data = this.horses;
        }
      })
    }
  }

  showHorseInfos(horseId: any) {
    console.log("horse id is " + horseId);

  //TODO implement showhorse infos (dialog view)
  }


  update() {
    //TODO implement, means that a horse should have been removed
    //var "toRemove" - add snackbar

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

  private async matchOwner(){
    this.horses.forEach((value:any, index) =>{
      let val = value['horseOwner'][0];
      if(value['horseOwner'].length > 0){
        let horseOwner = {
          ownerId : val['_id'],
          ownerName : val['name'],
          ownerSurname : val['surname']
        }
        this.horses[index]['horseOwner'] = horseOwner;
      }
      if(value['clubOwner'].length > 0){
        val = value['clubOwner'][0];
        let clubOwner = {
          ownerId: val['_id'],
          ownerName: val['clubName']
        }
        this.horses[index]['clubOwner'] = clubOwner;
      }
    })
  }

  private async matchPrivateHorse() { //TODO add way to remove horse
    this.horses.forEach((h:{horseName: string, riders: string[], scholastic: boolean}, index) => {
      console.log("h " + h.horseName)
      this.horses[index]['horseOwner'] = {
        ownerName: this.infos['name'],
        ownerSurname: this.infos['surname']
      };
      // this.horses[index]['clubOwner'] = ""; //TODO MAGHEGGI BRUTTI
    })
  }
}
