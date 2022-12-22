import { Injectable } from '@angular/core';
import {
  CalendarSchedulerEvent,
  CalendarSchedulerEventStatus,
  CalendarSchedulerEventAction
} from 'angular-calendar-scheduler';

import {HttpClient} from "@angular/common/http";
import {LessonService} from "./lesson.service";
import {LessonState} from "../_utils/Lesson";

@Injectable({
  providedIn: 'root'
})
export class AppCalendarService {
  constructor(private http: HttpClient, private lessonService:LessonService) { }

  getEvents(lesson: LessonState[], actions: CalendarSchedulerEventAction[]): Promise<CalendarSchedulerEvent[]> {
    let lessons = lesson;

    const data: CalendarSchedulerEvent[] | PromiseLike<CalendarSchedulerEvent[]> = [];
    lessons.forEach((l: LessonState)=>{
      console.log("value app calendar " + l)
      // let lessonRefactored = this.lessonService.matchPairs(value);
      let contentString: string = 'Clicca per ulteriori informazioni';

      let event = <CalendarSchedulerEvent>{
        id: l.lessonId,
        start: new Date(l.beginDate),
        end: new Date(l.endDate),
        title: 'Istruttore: ' + l.coach['coachName'] + ' ' + l.coach['coachSurname'],
        content: contentString,
        data: l,
        color: { primary: '#E0E0E0', secondary: '#EEEEEE' },
        actions: actions,
        isClickable: true,
        isDisabled: false,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
      data.push(event);
    })
    return new Promise(resolve => setTimeout(() => resolve(data), 3000));
  }
}
