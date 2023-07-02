import { IOrderClass } from "./global";

declare interface IOrderRequest extends IOrderClass {
  coupon?: string;
  isCouponApplied: boolean;
  requestDate: Date;
  contactPhone: string;
  rejectionReasons: IRejectionReasons;
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

declare interface IRejectionReasons {
  isOutOfStock: boolean;
  isUnreachable: boolean;
  others: string;
}
