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
