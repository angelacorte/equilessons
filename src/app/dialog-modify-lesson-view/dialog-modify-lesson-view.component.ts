import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {LessonService, LessonState} from "../_services/lesson.service";
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
      coachName: '',
      coachSurname: ''
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
    }]
  }

  updateLesson !: LessonState;
  isClub:boolean = false;
  infos:any;
  arenas = [];
  riders = [];
  horses = [];
  coaches = [];
  dataSource = new MatTableDataSource(this.form.pairs);

  errorMessage = '';

  tmpRider:any;
  tmpHorse:any;

  displayedColumns = ['bin', 'allievo', 'cavallo'];

  constructor(public dialogRef: MatDialogRef<DialogModifyLessonViewComponent>, private _snackBar: MatSnackBar, public dialog: MatDialog,private http: HttpClient, private lessonService: LessonService, private tokenStorage: TokenStorageService,private arenaService: ArenaService, private clubService: ClubService, private horseService: HorseService, private changeDetectorRefs: ChangeDetectorRef,
  @Inject(MAT_DIALOG_DATA) public data: any){ }

  async ngOnInit(): Promise<void> {
    this.isClub = this.tokenStorage.isClub();

    if (this.isClub) { //check on user's login
      this.infos = this.tokenStorage.getInfos(this.tokenStorage.isClub()); //get the infos saved in the session

      this.form.clubId = this.infos['_id'];
      this.arenas = await this.getClubArenas(this.infos['_id']);
      this.riders = await this.getClubAthletes(this.infos['_id']);
      this.horses = await this.getScholasticHorses(this.infos['_id']);
      this.coaches = await this.getClubCoaches(this.infos['_id']);

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

    //convert the date in a format supported by html
    this.form.lessonDate = lessonBeginDate.getFullYear() + '-' + (lessonBeginDate.getMonth() + 1) + '-' + lessonBeginDate.getDate();
    this.form.lessonHour = lessonBeginDate.getHours() + ':' + (lessonBeginDate.getMinutes() < 10 ? '0' + lessonBeginDate.getMinutes().toString() : lessonBeginDate.getMinutes());

    //calculate the lesson duration
    this.form.lessonDuration = (lessonEndDate.valueOf() - lessonBeginDate.valueOf()) / 60000;

    //set the arenaId
    await this.matchArena(this.updateLesson.arenaName).then((r:any)=>{
      console.log("dialog modify ", r);
      this.form.arena['arenaId'] = r._id;
      this.form.arena['arenaName'] = r.arenaName;
    });

    //set the coachId
    this.form.coach = this.updateLesson.coach;

    this.form.pairs = this.updateLesson.pairs;

  }

  private async getClubArenas(id:any):Promise<any>{
    return await this.arenaService.getClubArenas(id).toPromise();
  }

  private async getClubAthletes(id:any):Promise<any>{
    return await this.clubService.getClubAthletes(id).toPromise();
  }

  private async getScholasticHorses(id:any):Promise<any>{
    return await this.horseService.getScholasticHorses(id);
  }

  private async getClubCoaches(id:any):Promise<any>{ //remove user's id from coaches list if id is not referred to club
    let coaches = await this.clubService.getClubCoaches(id).toPromise();
    coaches.forEach((item:any,index:any)=>{
      if(item['_id'] === this.infos['_id']){
        this.coaches.splice(index, 1);
      }
    });
    return coaches[0].clubCoaches;
  }

  private async matchArena(arenaName:any):Promise<any>{
    let arena:any;
    await this.arenas.forEach((value:any) => {if (value.arenaName === arenaName) arena = value;});
    return arena;
  }

  onSave(_id: any) {
    console.log("this form on save", this.form);

    this.form.lessonDate = new Date(this.form.lessonDate);
    let beginDate = new Date(this.form.lessonDate.getFullYear()+' '+(this.form.lessonDate.getMonth()+1) +' '+this.form.lessonDate.getDate() + ' ' + this.form.lessonHour.toString()); //TODO non worka
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
      arenaId: this.form.arena['arenaId'],
      coachId: this.form.coach['coachId'],
      clubId: clubId,
      pairs: pairs,
    }

    this.lessonService.updateLesson(lesson).subscribe(response=>{
      this.onClose();
      this.openSnackbar("Lezione aggiornata con successo");
    }, err => {
      this.openSnackbar("Errore nell'aggiornamento della lezione");
      console.log(err);
    })
  }

  onClose() {
    this.dialogRef.close();
  }

  updateCoach() {
    this.coaches.some((obj:any)=>{
      if(obj._id === this.form.coach['coachId']){
        this.form.coach['coachName'] = obj.name
        this.form.coach['coachSurname'] = obj.surname
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

  onDelete() {
    let today = new Date();
    let lessonDay = new Date(this.updateLesson.beginDate);
    if(today > lessonDay){
      this._snackBar.open("Non è possibile cancellare una lezione passata", "Ok", {
        duration: 5000
      });
    } else if( today <= lessonDay){
      //TODO implement delete lesson
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
