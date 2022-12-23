import {RiderInfo} from "./Person";

export interface HorseInfos {
  horseId?: string,
  horseName: string,
  horseMicrochip: number,
  horseFise?: string,
  horseOwner: HorseOwner,
  clubId: string,
  horseBirthday?: Date,
  riders: Array<RiderInfo>,
  scholastic?: boolean
}

export interface HorseOwner {
  ownerId: string,
  ownerName: string,
  ownerSurname: string
}
