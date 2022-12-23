export interface UserInfos{
  name: string,
  surname: string,
  phoneNumber: number,
  email: string,
  birthday: dateFns, //todo change
  taxcode: string,
  city: string,
  address: string,
  nrFise: string,
  horse: any,
  roles: any,
  _id: string
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
