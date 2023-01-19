export interface UserInfos{
  _id: string,
  name: string,
  surname: string,
  phoneNumber: number,
  email: string,
  clubId: string,
  birthday?: Date,
  taxcode?: string,
  city?: string,
  address?: string,
  nrFise?: string,
  horse?: any,
  roles?: any,
  temporary?: boolean
}

export interface ClubInfos {
  _id: string,
  clubAddress: string,
  clubCity: string,
  clubCoach: Array<string>,
  clubEmail: string,
  clubName: string,
  clubTelephone: number
}

export interface Coach {
  _id: string,
  name: string,
  surname: string
}

export interface RiderInfo {
  riderId: string,
  riderName: string,
  riderSurname: string
}

export interface Login{
  username: string,
  password: string
}

export enum Roles{
  COACH = 'coach'
}
