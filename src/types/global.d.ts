import { EOrderRequestStatus } from "./enums";

declare interface ILocalizedString {
  en: string;
  ar: string;
}

declare interface IImage {
  ETag: string;
  ServerSideEncryption: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}

declare interface ICustomResponse<T> {
  success: boolean;
  code: number;
  error?: string;
  data?: {
    records?: T[];
    record?: T;
  };

  counts?: number;
}

declare enum EUserType {
  CLIENT = "client",
  VENDOR = "vendor",
  ADMIN = "admin",
  ORG = "org",
  BRANCH = "branch",
  AGENT = "agent",
  PARENT = "parent",
  CHILD = "child",
}

declare interface IProduct {
  _id: string;
  name: ILocalizedString;
  vendor: string;
  branches: string[];
  category: string;
  price: number;
  originalPrice: number;
  image: IImage[];
  isActive: boolean;
  isHotDeal: boolean;
  isLimited: boolean;
  isEditable: boolean;
  rate: number;
  numOfReviews: number;
  description: ILocalizedString;
  rank: number;
  vendorRank: number;
  __v: number;
}
export interface IOrderClass {
  _id: string;
  client: IClient;
  vendor: IVendor;
  branch: IBranch;
  items: IOrderItem[];

  total: number;
  originalTotal: number;

  points: number;
  usedPoints?: IUsedPoints;

  paymentMethod: TpaymentMethod;

  shippingAddress?: IShippingAddress;
  shippingFees?: number;

  purchaseDate: string;
  status: EOrderRequestStatus;

  __v: number;
}

declare interface ISumUser {
  _id: string;
  name: ILocalizedString;
  image?: IImage;
}
declare interface IClient extends ISumUser {
  phone?: string;
  usedFreeTrial?: boolean;
  isSubscribed?: boolean;
}

declare interface IVendor extends ISumUser {}

declare interface IBranch extends ISumUser {}
declare interface IShippingAddress {
  city?: string;
  street?: string;
  country?: string;
  district?: string;
  flatNumber?: string;
  specialMark?: string;
  buildingNumber?: string;
}

declare interface IUsedPoints {
  vendorPoints: number;
  systemPoints: number;
  pointsValue: number;
  discount: number;
}

declare interface IOrderItem {
  product: IProduct;
  quantity: number;
  total: number;
  _id: string;
}

declare type TpaymentMethod = "cash on delivery" | "visa" | "branch";
