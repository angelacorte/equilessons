export class User{
  username?: string;
  password?: string;
  hashSalt?: string;
  name?: string;
  surname?: string;
  nrFise?: string;
  birthday?: Date;
  phoneNumber?: number;
  email?: string;
  birthLocation?: string;
  taxCode?: string;
  location?: {
    address?: string;
    civic?: number;
    city?: string;
    postalCode?: number;
    county?: string;
    country?: string;
  };
  nationality?: string;
  club?: string;
  roles?: string;
}
