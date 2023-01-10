import {RiderInfo} from "./Person";

export interface HorseInfos {
  _id?: string,
  horseName: string,
  horseMicrochip: number,
  horseFise?: string,
  owner: HorseOwner,
  clubId: string,
  horseBirthday: Date | string,
  riders: Array<string>,
  scholastic?: boolean
}

export interface HorseOwner {
  _id: string,
  name: string,
  surname?: string
}
