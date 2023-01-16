import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HorseInfos} from "../_utils/Horse";
import {UserService} from "../_services/user.service";
import {SnackBarActions, SnackBarMessages} from "../_utils/Utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogModifyHorseComponent} from "../dialog-modify-horse/dialog-modify-horse.component";

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
              private _snackBar: MatSnackBar,
              public dialog: MatDialog,
               @Inject(MAT_DIALOG_DATA) public data: HorseInfos) { }

  ngOnInit(): void {
    this.horse = this.data;
    let date = new Date(this.horse.horseBirthday)
    this.horse.horseBirthday = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    if(this.horse.riders.length > 0) {
      this.horse.riders.forEach((riderId) => {
        this.userService.getUserById(riderId).then((res) => {
          if(res.status == 200){
            this.riders.push(res.user)
          }else{
            this.openSnackbar(SnackBarMessages.NOT_POSSIBLE, SnackBarActions.RELOAD)
          }
        })
      })
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onModify() {
    this.onClose();
    this.dialog.open(DialogModifyHorseComponent, {
      width: '650px',
      data: this.horse
    })
  }

  private openSnackbar(message:string, option: SnackBarActions){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      switch (option) {
        case SnackBarActions.RELOAD:
          window.location.reload();
          break;
      }
    })
  }
}
