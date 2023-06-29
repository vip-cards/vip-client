interface ICity {
  index: number;
  en: string;
  ar: string;
}

declare interface ICountry {
  en: string;
  ar: string;
  index: number;
  code: string;
  cities?: ICity[];
  alpha3?: string;
}

declare interface IMappedCity {
  _id: number;
  name: ILocalizedString;
  en: string;
  ar: string;
  index: number;
}

declare interface IMappedCountry {
  _id: number;
  name: ILocalizedString;
  cities: IMappedCity[];
  en: string;
  ar: string;
  index: number;
  code: string;
  alpha3?: string;
}
