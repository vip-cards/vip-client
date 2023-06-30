declare interface IRoom {
  _id: string;
  members: IMembers;
  messages?: IMessage[];
  lastUpdated: Date;
  isBlocked?: boolean;
  lastMessage?: IMessage;
}

declare interface IMembers {
  [key: EUserType]: IChatter;
}

declare interface IChatter {
  _id: string;
  name: ILocalizedString;
  image?: IImage;
}

declare interface IMessage {
  _id: string;
  text: string;
  timestamp: string;
  [key: EUserType]: IChatter;
}
