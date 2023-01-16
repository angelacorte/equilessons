import {
  endOfDay,
  addMonths
} from 'date-fns';
import {
  DAYS_IN_WEEK,
  SchedulerViewDay,
  SchedulerViewHour,
  SchedulerViewHourSegment,
  CalendarSchedulerEvent,
  CalendarSchedulerEventAction,
  startOfPeriod,
  endOfPeriod,
  addPeriod,
  subPeriod,
  SchedulerDateFormatter,
  SchedulerEventTimesChangedEvent,
  CalendarSchedulerViewComponent
} from 'angular-calendar-scheduler';
import {
  CalendarView,
  CalendarDateFormatter,
  DateAdapter
} from 'angular-calendar';
import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from "@angular/core";
import {Subject} from "rxjs";
import {LessonService} from "../_services/lesson.service";
import {LessonState} from "../_utils/Lesson";
import {TokenStorageService} from "../_services/token-storage.service";
import {AppCalendarService} from "../_services/app-calendar.service";
import {DialogLessonViewComponent} from "../dialog-lesson-view/dialog-lesson-view.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: SchedulerDateFormatter
  }]
})

export class CalendarComponent implements OnInit {
  title = 'Calendario lezioni ';

  CalendarView = CalendarView;

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  viewDays: number = 1;
  refresh: Subject<any> = new Subject();
  locale: string = 'it';
  hourSegments: 1|2|4|6 = 2;
  weekStartsOn: number = 1;
  startsWithToday: boolean = false;
  activeDayIsOpen: boolean = true;
  excludeDays: number[] = []; // [0];
  dayStartHour: number = 7;
  dayEndHour: number = 21;

  minDate: Date = new Date();
  maxDate: Date = endOfDay(addMonths(new Date(), 1));
  dayModifier!: Function;
  hourModifier!: Function;
  segmentModifier: Function;
  eventModifier: Function;
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;

  isLoggedIn = false;
  infos!: any;
  lessons: LessonState[] = [];
  isClub: boolean = false;
  isCoach: boolean = false;



  actions: CalendarSchedulerEventAction[] = [
    {
      when: 'enabled',
      label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">cancel</i></span>',
      title: 'Delete',
      onClick: (event: CalendarSchedulerEvent): void => {
        console.log('Pressed action \'Delete\' on event ' + event.id);
      }
    },
    {
      when: 'cancelled',
      label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">autorenew</i></span>',
      title: 'Restore',
      onClick: (event: CalendarSchedulerEvent): void => {
        console.log('Pressed action \'Restore\' on event ' + event.id);
      }
    }
  ];

  events!: CalendarSchedulerEvent[];

  @ViewChild(CalendarSchedulerViewComponent) calendarScheduler!: CalendarSchedulerViewComponent;

  constructor(@Inject(LOCALE_ID) locale: string, public dialog: MatDialog, private lessonService: LessonService, private tokenStorage: TokenStorageService, private appService: AppCalendarService, private dateAdapter: DateAdapter) {
    this.locale = locale;

    // this.dayModifier = ((day: SchedulerViewDay): void => {
    //     day.cssClass = this.isDateValid(day.date) ? '' : 'cal-disabled';
    // }).bind(this);

    // this.hourModifier = ((hour: SchedulerViewHour): void => {
    //     hour.cssClass = this.isDateValid(hour.date) ? '' : 'cal-disabled';
    // }).bind(this);

    this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
      segment.isDisabled = !this.isDateValid(segment.date);
    }).bind(this);

    this.eventModifier = ((event: CalendarSchedulerEvent): void => {
      event.isDisabled = !this.isDateValid(event.start);
    }).bind(this);

    this.dateOrViewChanged();
  }

  async ngOnInit() {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      this.isClub = this.tokenStorage.isClub();
      this.infos = await this.tokenStorage.getInfos(this.isClub);
      if (!this.isClub) this.isCoach = this.tokenStorage.isCoach()
      await this.fetchData();
    }else{
      window.location.assign('/notAllowed'); //if the page is opened without being logged redirect
    }
  }

  viewDaysOptionChanged(viewDays: string): void {
    this.calendarScheduler.setViewDays(Number(viewDays));
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  changeView(view: CalendarView): void {
    this.view = view;
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    if (this.startsWithToday) {
      this.prevBtnDisabled = !this.isDateValid(subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
      this.nextBtnDisabled = !this.isDateValid(addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
    } else {
      this.prevBtnDisabled = !this.isDateValid(endOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
      this.nextBtnDisabled = !this.isDateValid(startOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
    }

    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  private isDateValid(date: Date): boolean {
    return /*isToday(date) ||*/ date >= this.minDate && date <= this.maxDate;
  }

  viewDaysChanged(viewDays: number): void {
    console.log('viewDaysChanged', viewDays);
    this.viewDays = viewDays;
  }

  dayHeaderClicked(day: SchedulerViewDay): void {
    console.log('dayHeaderClicked Day', day);
  }

  hourClicked(hour: SchedulerViewHour): void {
    console.log('hourClicked Hour', hour);
  }

  segmentClicked(action: string, segment: SchedulerViewHourSegment): void {
    console.log('segmentClicked Action', action);
    console.log('segmentClicked Segment', segment);
  }

  eventClicked(action: string, event: CalendarSchedulerEvent): void {
    this.lessons.some((obj:LessonState)=>{
      if (obj.lessonId === event.id) this.showLessonInfo(obj);
    })
  }

  eventTimesChanged({ event, newStart, newEnd, type }: SchedulerEventTimesChangedEvent): void {
    // @ts-ignore
    const ev: CalendarSchedulerEvent = this.events.find(e => e.id === event.id);
    ev.start = newStart;
    ev.end = newEnd;
    // this.refresh.next(); todo
  }

  private async fetchData() {
    let id: string;

    if (this.isClub) {
      this.title += this.infos.clubName
      id = this.infos._id
    } else if(this.isCoach) {
      id = this.infos.clubId
      this.title += this.infos.name
    }else {
      this.title += this.infos.name
      id = this.infos._id
    }
    if(this.isClub || this.isCoach){
      await this.lessonService.getLessonsByClubId(id).then(res => {
        if (res.status == 200) {
          this.lessons = res.lessons
          this.appService.getEvents(this.lessons, this.actions)
            .then((events: CalendarSchedulerEvent[]) => this.events = events);
        }
      })
    }else{
      await this.lessonService.getUserLessons(id).then(res => {
        if(res.status == 200){
          this.lessons = res.lesson
          this.appService.getEvents(this.lessons, this.actions)
            .then((events: CalendarSchedulerEvent[]) => this.events = events);
        }
      })
    }
  }

  private showLessonInfo(lesson: LessonState) {
    let data = {
      lesson: lesson,
      isClub: this.isClub,
      userId: this.infos['_id'],
      isCoach: this.isCoach
    };
    this.dialog.open(DialogLessonViewComponent, {
      width: '650px',
      data: data
    });
  }
}

