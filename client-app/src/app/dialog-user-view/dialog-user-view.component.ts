import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UserInfos} from "../_utils/Person";


@Component({
  selector: 'app-dialog-user-view',
  templateUrl: './dialog-user-view.component.html',
  styleUrls: ['./dialog-user-view.component.css']
})
export class DialogUserViewComponent implements OnInit{

  user!: UserInfos;
  horses: any;

  constructor(
    public dialogRef: MatDialogRef<DialogUserViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserInfos) {}

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.user = this.data;
    if(this.data.horse.length > 0) this.horses = this.data.horse;

  }
}
