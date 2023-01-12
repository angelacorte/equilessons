import {Coach, RiderInfo} from "./Person";
import {HorseInfos} from "./Horse";
import {ArenaInfo} from "./Arena";

export interface LessonState {
  lessonId: string,
  beginDate: Date,
  endDate: Date,
  arena: ArenaInfo,
  coach: Coach,
  pairs: Pairs[],
  notes: string,
  clubId: string
}

export interface Pairs {
  riderInfo: RiderInfo,
  horseInfo: HorseInfos
}

export function Lesson(
  lessonId: string,
  beginDate: Date,
  endDate: Date,
  arena: ArenaInfo,
  coach: Coach,
  pairs: Pairs[],
  notes: string,
  clubId: string): LessonState {
    return {lessonId: lessonId, beginDate: beginDate, endDate: endDate, arena: arena, coach: coach, pairs: pairs, notes: notes, clubId: clubId}
}