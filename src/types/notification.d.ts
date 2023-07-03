declare interface INotification {
  _id: string;
  text: string;
  link: string;
  image: IImage;
  seen: boolean; // this is local from redux
  seenBy: string[]; // this is from network

  // targets
  country?: ICountry;
  city: ICity;
  gender: "male" | "female";
  age: IAge;

  // time
  timestamp: string;
  startDate: string;
  endDate: string;

  reach: number;
  clicks: number;
  __v: number;
  ad?: string;
}

declare interface IAge {
  from: number;
  to: number;
}
