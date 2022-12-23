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
  displayedColumns = ['checkbox','sender', 'message', 'date']; //todo add read
  dataSource = new MatTableDataSource(this.notifications);
  isClub: boolean = false;
  isLoggedIn: boolean = false;
  constructor(private userService:UserService, public dialog: MatDialog, private _snackBar: MatSnackBar, private horseService: HorseService, private tokenStorage: TokenStorageService) { }

  async ngOnInit(): Promise<void> {
    this.isClub = this.tokenStorage.isClub();
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if(this.isLoggedIn && this.isClub){ //todo can send notifications
      let not1: NotificationMessage = {sender: "miao", message: NotificationType.ADD, lessonID: "24199d", date: Date.now().toString(), lessonDate: "12/10/2022"}
      let not2: NotificationMessage = {sender: "miao", message: NotificationType.MODIFY, lessonID: "24199d", date: Date.now().toString(), lessonDate: "12/10/2022"}
      this.notifications.push(not1, not2)
      console.log(this.notifications);
      this.setDataSource(this.notifications);
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