import {RiderInfo} from "./Person";

export interface HorseInfos {
  _id?: string,
  horseName: string,
  horseMicrochip: number,
  horseFise?: string,
  horseOwner: HorseOwner,
  clubId: string,
  horseBirthday: Date | string,
  riders: Array<string>,
  scholastic?: boolean
}

export interface HorseOwner {
  ownerId: string,
  ownerName: string,
  ownerSurname: string
}
