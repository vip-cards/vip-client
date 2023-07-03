declare interface IService {
  _id: string;
  provider: string;
  serviceName: ILocalizedString;
  providerName: ILocalizedString;
  description: ILocalizedString;
  address: ILocalizedString;
  category: { _id?: ICategoryId }[];
  contacts: IContacts;
  publishDate: string;
  isActive: boolean;
  mobilityStatus?: boolean;
  __v: number;
}

declare interface ICategoryId {
  _id: string;
  name: ILocalizedString;
  image: IImage;
}

declare interface IContacts {
  phone: number;
  whatsapp: number;
  telegram: number;
}
