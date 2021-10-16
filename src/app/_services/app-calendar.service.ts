import { Injectable } from '@angular/core';
import {
  CalendarSchedulerEvent,
  CalendarSchedulerEventStatus,
  CalendarSchedulerEventAction
} from 'angular-calendar-scheduler';

import {HttpClient} from "@angular/common/http";
import {LessonService} from "./lesson.service";

@Injectable({
  providedIn: 'root'
})
export class AppCalendarService {
  constructor(private http: HttpClient, private lessonService:LessonService) { }

  getEvents(lesson: any, actions: CalendarSchedulerEventAction[]): Promise<CalendarSchedulerEvent[]> {
    let lessons = lesson;

    const data: CalendarSchedulerEvent[] | PromiseLike<CalendarSchedulerEvent[]> = [];
    lessons.forEach((value: any)=>{
      let lessonRefactored = this.lessonService.matchPairs(value);
      let contentString: string = 'Clicca per ulteriori informazioni';

      let event = <CalendarSchedulerEvent>{
        id: value._id,
        start: new Date(value.beginDate),
        end: new Date(value.endDate),
        title: 'Istruttore: ' + lessonRefactored.coach['coachName'] + ' ' + lessonRefactored.coach['coachSurname'],
        content: contentString,
        data: value,
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
