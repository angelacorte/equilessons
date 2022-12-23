export interface UserInfos{
  _id: string,
  name: string,
  surname: string,
  phoneNumber: number,
  email: string,
  clubId: string,
  birthday?: dateFns, //todo change
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
  coachId: string,
  coachName: string,
  coachSurname: string
}

export interface RiderInfo {
  riderId: string,
  riderName: string,
  riderSurname: string
}
