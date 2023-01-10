import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {UserService} from "../_services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HorseService} from "../_services/horse.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {NotificationMessage, NotificationType} from "../_utils/Notification";
import { NotificationService } from '../_services/notification.service';
import { SocketIoService } from 'app/_services/socket-io.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @ViewChild(MatTable, {static:false}) table!: MatTable<any>;
  @ViewChild(MatSort, {static:false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;

  notifications:NotificationMessage[] = [];
  displayedColumns = ['checkbox','sender', 'object', 'date', 'message'];
  dataSource = new MatTableDataSource(this.notifications);
  isClub: boolean = false;
  isLoggedIn: boolean = false;
  userId: string = ""
  notificationsToDelete: any[] = []

  constructor(
    private notificationService: NotificationService,
    public dialog: MatDialog,  
    private tokenStorage: TokenStorageService,
    private socketIoService: SocketIoService) { 
      this.isClub = this.tokenStorage.isClub();
      this.isLoggedIn = !!this.tokenStorage.getToken();
      this.userId = this.tokenStorage.getInfos(this.isClub)._id
  
      
      this.socketIoService.eventObservable('notify-client').subscribe((data)=>{
        console.log("received notification")
        this.refreshNotifications(this.userId)
      })

    }

  async ngOnInit(): Promise<void> {
    if(this.isLoggedIn){ 
      //call the service to retrieve user's notifications
      await this.refreshNotifications(this.userId)
    }
  }

  private setDataSource(data: NotificationMessage[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }

  private async refreshNotifications(userId: string): Promise<void>{
    try {
      this.notifications = await this.notificationService.getNotifications(userId)
      this.setDataSource(this.notifications)
    } catch(err) {
      console.log(err)
    }
  }

  async checkNotification(n: NotificationMessage) {
    if(!n.checked){
      n.checked = true
      this.notificationsToDelete.push(n)
    } else {
      n.checked = false
      this.notificationsToDelete = this.notificationsToDelete.filter(n1 => n1 != n)
    }
  }

  goToLesson(lessonId: string) {
    console.log("id is " + lessonId)
  }

  async update() {
    console.log(this.notificationsToDelete)
    await this.deleteNotifications()
    await this.refreshNotifications(this.userId)
  }

  private async deleteNotifications(): Promise<void> {
    this.notificationsToDelete.forEach(async (n) => {
      try {
        const id = n._id
        if(id) {
          console.log(`deleting notification ${id}`)
          await this.notificationService.deleteNotification(id)
        }
      } catch(err) {
        console.log(err)
      }
    });
  }
}
