import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {ArenaService} from "../_services/arena.service";
import {map} from "rxjs/operators";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-new-arena',
  templateUrl: './new-arena.component.html',
  styleUrls: ['./new-arena.component.css']
})
export class NewArenaComponent implements OnInit {

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<any>;

  form:any = {
    arenaName:[],
    clubId: ""
  }

  isSuccessful = false;
  isRegistrationFailed = false;
  errorMessage = '';
  submitted = false;
  isLoggedIn = false;
  infos: any;
  arenas = [];
  toUpdate: {clubId:any, arenaName:string}[] = [];
  toRemove: {arenaId: any}[] = [];
  //isClub: boolean = false;
  displayedColumns = ['checkbox', 'arenaName'];


  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private arenaService: ArenaService) {

  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
      this.fetchData();
    }else{
      window.location.assign('/notAllowed');
    }
  }

  onSubmit(): void {
    /*let newArenas: { arenaName: never; clubId: any; }[] = [];
    this.arenas.forEach(value => {
      let arena = {
        arenaName: value,
        clubId: this.form.clubId
      }
      newArenas.push(arena);
    })*/
    console.log("this.toupdate", this.toUpdate);

    this.arenaService.addArena(this.toUpdate).subscribe(response=>{
      this.submitted = true;
      this.isSuccessful = true;
      console.log("this.toupdate", this.toUpdate);
      if(this.toRemove.length > 0){
        this.arenaService.removeArena(this.toRemove).subscribe(resp =>{
          console.log("this.toRemove",this.toRemove)
          window.location.reload();
        }, err => {
          this.errorMessage = err.error.message;
          this.isRegistrationFailed = true;
          console.log(err);
        })
      }else {
        window.location.reload();
      }
    }, err => {
      this.errorMessage = err.error.message;
      this.isRegistrationFailed = true;
      console.log(err);
    })
  }

  addArenaToList(value: string) {
    let arena = {
      _id: '',
      arenaName: value
    };
    // @ts-ignore
    this.arenas.push(arena);
    let up = {
      clubId: this.infos._id,
      arenaName: arena.arenaName
    }
    this.toUpdate.push(up);
    this.table.renderRows();
  }

  isArenaUnchecked(e: any, arenaId:any) {
    if(!e.target.checked){
      this.arenas.forEach((item, index)=>{
        if(this.arenas[index] === arenaId){
          this.arenas.splice(index, 1);
          this.toRemove.push(arenaId);
          this.table.renderRows();
          console.log("this.arenas", this.arenas)
        }
      });
    }
  }

  private fetchData() {
    console.log("fetch data this.infos._id", this.infos._id)
    this.arenaService.getClubArenas(this.infos._id).pipe(map(responseData =>{
      const dataArray = [];
      for ( const key in responseData){
        if(responseData.hasOwnProperty(key)){
          // @ts-ignore
          dataArray.push({...responseData[key]})
        }
      }
      return dataArray;
    })).subscribe(response=>{
      // @ts-ignore
      this.arenas = response;
      console.log("arenas", this.arenas);
    });
  }
}
