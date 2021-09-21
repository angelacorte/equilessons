import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {ArenaService} from "../_services/arena.service";

@Component({
  selector: 'app-new-arena',
  templateUrl: './new-arena.component.html',
  styleUrls: ['./new-arena.component.css']
})
export class NewArenaComponent implements OnInit {

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
  //isClub: boolean = false;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private arenaService: ArenaService) {

  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn && this.tokenStorage.isClub()) {
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub());
    }else{
      window.location.assign('/notAllowed');
    }
  }

  onSubmit(): void {
    let newArenas: { arenaName: never; clubId: any; }[] = [];
    this.arenas.forEach(value => {
      let arena = {
        arenaName: value,
        clubId: this.form.clubId
      }
      newArenas.push(arena);
    })
    this.arenaService.addArena(newArenas).subscribe(response=>{
      this.submitted = true;
      this.isSuccessful = true;
    }, err => {
      this.errorMessage = err.error.message;
      this.isRegistrationFailed = true;
      console.log(err);
    })
  }

  addArenaToList(value: string) {
    // @ts-ignore
    this.arenas.push(value);
  }
}
