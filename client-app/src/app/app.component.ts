import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { SocketIoService } from './_services/socket-io.service';
import {TokenStorageService} from "./_services/token-storage.service";
import {ClubInfos, UserInfos} from "./_utils/Person";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'Equilessons';

  @Input() isLoggedIn!: boolean;
  // @Input() username?: string;
  isClub = false;
  infos !: ClubInfos | UserInfos
  isCoach!: boolean;
  perm=""
  constructor(private tokenStorage: TokenStorageService,  private router: Router , private socketIoService: SocketIoService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.isLoggedIn = changes.isLoggedIn.currentValue
  }

  async ngOnInit(): Promise<void> {
    if (this.isLoggedIn) {
      this.isClub = this.tokenStorage.isClub();
      this.infos = this.tokenStorage.getInfos(this.isClub);
      if(!this.isClub) this.isCoach = this.tokenStorage.isCoach()
    }else{
      this.router.events.subscribe(event => {
        if (event.constructor.name === "NavigationEnd") {
          this.isLoggedIn = !!this.tokenStorage.getToken();
          this.isClub = this.tokenStorage.isClub()
          if(!this.isClub) this.isCoach = this.tokenStorage.isCoach()
          this.infos = this.tokenStorage.getInfos(this.isClub)
        }
      })
    }

    this.perm = await Notification.requestPermission()
    if(this.perm === "granted"){
      console.log("notification permission granted")
      this.socketIoService.eventObservable('notify-client').subscribe((data)=>{
        new Notification(`Hai una nuova notifica di tipo ${data.data.notificationType}`)
      })
    } else {
      console.log("permission not granted")
    }
  }

  logout(): void {
    this.tokenStorage.logout();
    window.location.replace("/");
  }
}
