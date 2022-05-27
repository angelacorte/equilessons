export interface HorseInfos {
  horseName: string,
  horseMicrochip: number,
  horseFise: string,
  horseOwner: HorseOwner,
  clubId: string,
  horseBirthday: Date,
  riders: Array<string>, //todo modify in array of users
  scholastic: boolean
}

export interface HorseOwner {
  ownerId: string,
  ownerName: string,
  ownerSurname: string
}
