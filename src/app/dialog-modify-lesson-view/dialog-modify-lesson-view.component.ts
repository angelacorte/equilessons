import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {LessonService, LessonState} from "../_services/lesson.service";
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../_services/token-storage.service";
import {ArenaService} from "../_services/arena.service";
import {ClubService} from "../_services/club.service";
import {HorseService} from "../_services/horse.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatAccordion} from "@angular/material/expansion";

@Component({
  selector: 'app-dialog-modify-lesson-view',
  templateUrl: './dialog-modify-lesson-view.component.html',
  styleUrls: ['./dialog-modify-lesson-view.component.css']
})
export class DialogModifyLessonViewComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

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
    pairs: [],
    riders: '',
    horses: ''
  }

  updateLesson !: LessonState;
  isClub:boolean = false;
  infos:any;
  arenas = [];
  riders = [];
  horses = [];
  coaches = [];


  constructor(public dialogRef: MatDialogRef<DialogModifyLessonViewComponent>,public dialog: MatDialog,private http: HttpClient, private lessonService: LessonService, private tokenStorage: TokenStorageService,private arenaService: ArenaService, private clubService: ClubService, private horseService: HorseService, private changeDetectorRefs: ChangeDetectorRef,
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

      console.log("this.arenas", this.arenas)
      await this.modifyLesson();

      //this.fetchData() //get the data from the db

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
    console.log("this.updateLesson.arenaName",this.updateLesson.arenaName)
    await this.matchArena(this.updateLesson.arenaName).then((r:any)=>{
      this.form.arena['arenaId'] = r._id;
      this.form.arena['arenaName'] = r.arenaName;
    });

    //set the coachId
    this.form.coach = this.updateLesson.coach;

    console.log("getLessonState()", this.lessonService.getLessonState())
    console.log("this.form", this.form);
  }

  private async getClubArenas(id:any):Promise<any>{
    return await this.arenaService.getClubArenas(id).toPromise();
  }

  private async getClubAthletes(id:any):Promise<any>{
    return await this.clubService.getClubAthletes(id).toPromise();
  }

  private async getScholasticHorses(id:any):Promise<any>{
    return await this.horseService.getScholasticHorses(id).toPromise();
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

  // @ts-ignore
  private async matchArena(arenaName:any):Promise<any>{
    let arena:any;

    await this.arenas.forEach((value:any) => {
      console.log("value", value)
      if (value.arenaName === arenaName) {
        console.log("value.arenaName", value.arenaName)
        console.log("arenaName", arenaName)
        console.log("value.id", value._id)
        arena = value;
      }
    });
    return arena;
  }

  onSave(_id: any) {
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
}
