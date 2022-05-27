import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HorseInfos} from "../_utils/Horse";
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-dialog-horse-view',
  templateUrl: './dialog-horse-view.component.html',
  styleUrls: ['./dialog-horse-view.component.css']
})
export class DialogHorseViewComponent implements OnInit {

  horse!:HorseInfos;
  riders: {_id: string, name: string, surname: string}[] = [];

  constructor(private userService: UserService,
              public dialogRef: MatDialogRef<DialogHorseViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: HorseInfos) { }

  ngOnInit(): void {
    this.horse = this.data;
    if(this.horse.riders.length > 0) {
      this.horse.riders.forEach((riderId) => {
        this.userService.getUserById(riderId).toPromise().then((res) => {
          this.riders.push(res);
        })
      })
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  userInfo(_id: any) {
    console.log("TO IMPLEMENT");
  }
}
