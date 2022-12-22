export interface LessonState {
  lessonId: string,
  beginDate: Date,
  endDate: Date,
  arena: {
    arenaName: string,
    arenaId: string
  },
  coach: {
    coachId: string,
    coachName: string,
    coachSurname: string
  },
  pairs: [{
    riderInfo: {
      riderId: string,
      riderName: string,
      riderSurname: string
    },
    horseInfo:{
      horseId: string,
      horseName: string
    }
  }],
  notes: string
}
