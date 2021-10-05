import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../_services/user.service";
import {map} from "rxjs/operators";

export interface DialogData{
  name: string,
  surname: string,
  phoneNumber: number,
  email: string,
  birthday: dateFns,
  taxcode: string,
  city: string,
  address: string,
  nrFise: any,
  horse: any,
  roles: any,
  _id: any
}

@Component({
  selector: 'app-dialog-user-view',
  templateUrl: './dialog-user-view.component.html',
  styleUrls: ['./dialog-user-view.component.css']
})
export class DialogUserViewComponent implements OnInit{

  // @ts-ignore
  user: DialogData;
  horses: any;

  constructor(
    public dialogRef: MatDialogRef<DialogUserViewComponent>, private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.user = this.data;
    if(this.data.horse.length > 0) this.horses = this.data.horse;

  }

  horseInfo(horseId: any) {
    console.log("TO IMPLEMENT");
  }
}
