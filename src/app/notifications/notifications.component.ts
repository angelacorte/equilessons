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
  constructor(private notificationService: NotificationService, private userService:UserService, public dialog: MatDialog, private _snackBar: MatSnackBar, private horseService: HorseService, private tokenStorage: TokenStorageService) { }

  async ngOnInit(): Promise<void> {
    this.isClub = this.tokenStorage.isClub();
    this.isLoggedIn = !!this.tokenStorage.getToken();
    let userId = this.tokenStorage.getInfos(this.isClub)._id

    if(this.isLoggedIn){ 
      //call the service to retrieve user's notifications
      this.notifications = await this.notificationService.getNotifications(userId)
      console.log(JSON.stringify(this.notifications))
      this.setDataSource(this.notifications)
    }
  }

  private setDataSource(data: NotificationMessage[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }

  isNotificationUnchecked() {

  }

  goToLesson(lessonId: string) {
    console.log("id is " + lessonId)
  }

  update() {

  }
}
