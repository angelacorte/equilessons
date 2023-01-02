import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {LessonService} from "../_services/lesson.service";
import {LessonState} from "../_utils/Lesson";
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {ArenaService} from "../_services/arena.service";
import {ClubService} from "../_services/club.service";
import {HorseService} from "../_services/horse.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatAccordion} from "@angular/material/expansion";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";
import { NotificationType, Notification } from '../_utils/Notification';
import { NotificationService } from '../_services/notification.service';
import {Coach} from "../_utils/Person";
import {HorseInfos} from "../_utils/Horse";
import {ArenaInfo} from "../_utils/Arena";

@Component({
  selector: 'app-dialog-modify-lesson-view',
  templateUrl: './dialog-modify-lesson-view.component.html',
  styleUrls: ['./dialog-modify-lesson-view.component.css']
})
export class DialogModifyLessonViewComponent implements OnInit {

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatTable, {static:false}) table!: MatTable<any>;
  @ViewChild(MatSort, {static:false})
  set sort(value: MatSort) {
    if (this.form.pairs){
      this.form.pairs.sort = value;
    }
  }
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;

  form:any = {
    lessonDate: '',
    lessonHour: '',
    lessonDuration: '',
    clubId: '',
    arena:{
      arenaName:'',
      arenaId: ''
    },
    coach: {
      coachId:'',
      name: '',
      surname: ''
    },
    pairs: [{
      riderInfo:{
        riderId: '',
        riderName: '',
        riderSurname: ''
      },
      horseInfo:{
        horseId: '',
        horseName: ''
      }
    }],
    notes: ''
  }

  updateLesson !: LessonState;
  isClub:boolean = false;
  infos:any;
  arenas: ArenaInfo[] = [];
  riders = [];
  horses: HorseInfos[] = [];
  coaches: Coach[] = [];
  dataSource = new MatTableDataSource(this.form.pairs);

  errorMessage = '';

  tmpRider:any;
  tmpHorse:any;

  displayedColumns = ['bin', 'allievo', 'cavallo'];

  constructor(public dialogRef: MatDialogRef<DialogModifyLessonViewComponent>, private _snackBar: MatSnackBar, public dialog: MatDialog,private http: HttpClient, private lessonService: LessonService, private tokenStorage: TokenStorageService,private arenaService: ArenaService, private clubService: ClubService, private horseService: HorseService, private changeDetectorRefs: ChangeDetectorRef,
  @Inject(MAT_DIALOG_DATA) public data: any, private notificationService: NotificationService){ }

  async ngOnInit(): Promise<void> {
    this.isClub = this.tokenStorage.isClub();

    if (this.isClub) { //check on user's login
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub()); //get the infos saved in the session

      this.form.clubId = this.infos['_id'];
      this.arenas = await this.getClubArenas(this.infos['_id']);
      console.log("arenas ", this.arenas)
      this.riders = await this.getClubAthletes(this.infos['_id']);
      console.log("riders ", this.riders)
      this.horses = await this.getScholasticHorses(this.infos['_id']);
      console.log("horsez ", this.horses)
      this.coaches = await this.getClubCoaches(this.infos['_id']);
      console.log("coaches ", this.coaches)
      this.updateLesson = this.data;
      await this.modifyLesson();
      this.dataSource.data = this.form.pairs;
    } else {
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  private async modifyLesson() {

    let lessonBeginDate = new Date(this.updateLesson.beginDate);
    let lessonEndDate = new Date(this.updateLesson.endDate);
    //todo check why doesn't show the date

    //convert the date in a format supported by html
    this.form.lessonDate = lessonBeginDate.getFullYear() + '-' + (lessonBeginDate.getMonth() + 1) + '-' + lessonBeginDate.getDate();
    console.log("lesson date", this.form.lessonDate)
    this.form.lessonHour = this.getXXTime(lessonBeginDate.getHours()) + ':' + this.getXXTime(lessonBeginDate.getMinutes())
    //calculate the lesson duration
    this.form.lessonDuration = (lessonEndDate.valueOf() - lessonBeginDate.valueOf()) / 60000;
    //set the coachId
    this.form.coach = this.updateLesson.coach;
    this.form.pairs = this.updateLesson.pairs;
    this.form.arena = this.updateLesson.arena
    this.form.notes = this.updateLesson.notes
  }

  private getXXTime(x: number): string{
    return x < 10 ? '0' + x : x.toString()
  }

  private async getClubArenas(id:any):Promise<any>{
    return await this.arenaService.getClubArenas(id).then(res =>{
      if(res.status == 200){
        return res.arenas
      }else{
        //todo
      }
    });
  }

  private async getClubAthletes(id:any):Promise<any>{
    return await this.clubService.getClubAthletes(id);
  }

  private async getScholasticHorses(id:any):Promise<any>{
    return await this.horseService.getScholasticHorses(id);
  }

  private async getClubCoaches(id:string): Promise<Coach[]>{ //remove user's id from coaches list if id is not referred to club
    return await this.clubService.getClubCoaches(id).then((res) => {
      if(res.status == 200){
        return res.coaches
      }
    });
    /*coaches.forEach((item:any,index:any)=>{
      if(item['_id'] === this.infos['_id']){
        this.coaches.splice(index, 1);
      }
    });*/
  }

  private async matchArena(arenaName:any):Promise<any>{
    let arena:any;
    await this.arenas.forEach((value:any) => {if (value.arenaName === arenaName) arena = value;});
    return arena;
  }

  async onSave() {
    let beginDate = new Date(this.form.lessonDate);
    let endDate = new Date(beginDate.getTime() + this.form.lessonDuration*60000);
    let pairs: { riderId: any; horseId: any; }[] = [];

    this.form.pairs.forEach((val: any) =>{
      let pair = {
        riderId: val.riderInfo['riderId'],
        horseId: val.horseInfo['horseId']
      }
      pairs.push(pair);
    })

    let clubId;
    if(this.isClub) clubId = this.infos['_id'];
    else clubId = this.infos['clubId'];

    const lesson = {
      _id: this.updateLesson.lessonId,
      beginDate: beginDate,
      endDate: endDate,
      arenaId: this.form.arena['_id'],
      coachId: this.form.coach['coachId'],
      clubId: clubId,
      pairs: pairs,
      notes: this.form.notes
    }

    try {
      let newLesson: LessonState = await this.lessonService.updateLesson(lesson).toPromise()
      this.openSnackbar("Lezione aggiornata con successo")
      const notification = Notification(
        this.tokenStorage.getInfos(this.isClub)._id,
        pairs.pop()?.riderId,
        NotificationType.UPDATE,
        new Date(),
        newLesson.lessonId,
        newLesson.beginDate,
        newLesson.notes
      )
      await this.notificationService.createNotification(notification)
    } catch(err) {
      this.openSnackbar("Errore nell'aggiornamento della lezione, riprova.");
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  updateCoach() {
    this.coaches.some((obj:any)=>{
      if(obj._id === this.form.coach['coachId']){
        this.form.coach['name'] = obj.name
        this.form.coach['surname'] = obj.surname
      }
    })
  }

  updateArena() {
    this.arenas.forEach((value:any)=>{
      if(value._id === this.form.arena['arenaId']) this.form.arena['arenaName'] = value.arenaName
    })
  }

  addPair() {
    let tmpPair = {
      riderInfo: {
        riderId: this.tmpRider._id,
        riderName: this.tmpRider.name,
        riderSurname: this.tmpRider.surname
      },
      horseInfo:{
        horseId: this.tmpHorse._id,
        horseName: this.tmpHorse.horseName
      }
    }
    this.form.pairs.push(tmpPair);
    this.dataSource.data = this.form.pairs;
  }

  checkParticipants(riderInfo:any):boolean{
    return this.form.pairs.some((obj:any) => {
      if (obj.riderInfo.riderId === riderInfo._id)
        return true;
      return false;
    });
  }

  deletePair(riderId: any) {
    this.form.pairs.forEach((obj:any, index:any)=>{
      if(obj.riderInfo.riderId === riderId){
        this.form.pairs.splice(index,1);
        this.dataSource.data = this.form.pairs;
      }
    })
  }

  async onDelete() {
    let today = new Date();
    let lessonDay = new Date(this.updateLesson.beginDate);
    if (today > lessonDay) {
      this._snackBar.open("Non è possibile cancellare una lezione passata", "Ok", {
        duration: 5000
      });
    } else if (today <= lessonDay) {
      try {
        await this.lessonService.deleteLesson(this.updateLesson.lessonId)
        this.openSnackbar("Rimozione avvenuta con successo.")
        let recipient = this.updateLesson.pairs.pop()?.riderInfo.riderId
        if(!recipient) throw new Error
        const notification = Notification(
          this.tokenStorage.getInfos(this.isClub)._id,
          recipient,
          NotificationType.DELETE,
          new Date(),
          this.updateLesson.lessonId,
          this.updateLesson.beginDate,
          this.updateLesson.notes
        )
        await this.notificationService.createNotification(notification)
      } catch(err) {
        this.openSnackbar("Qualcosa è andato storto, riprova.")
      }
    }
  }

  private openSnackbar(message:any){
    let snackBarRef = this._snackBar.open(message, "Ok", {
      duration: 3000
    });
    snackBarRef.afterDismissed().subscribe(()=>{
      window.location.reload();
    })
  }

  private setDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.dataSource.sort;
    this.dataSource.paginator = this.paginator;
  }
}
