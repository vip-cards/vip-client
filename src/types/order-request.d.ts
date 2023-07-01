
declare interface IOrderRequest {
  _id: string;
  client: IClient;
  vendor: IVendor;
  branch: IBranch;
  items: IOrderRequestItem[];

  total: number;
  originalTotal?: number;

  points?: number;
  usedPoints: IUsedPoints;

  coupon?: string;
  isCouponApplied: boolean;

  paymentMethod: "cash on delivery" | "visa";

  shippingAddress: IShippingAddress;
  shippingFees: number;
  requestDate: Date;
  contactPhone: string;
  status: EOrderRequestStatus;
  rejectionReasons: IRejectionReasons;

  __v: number;
}

declare interface IClient extends ISumUser {
  phone: string;
  usedFreeTrial: boolean;
  isSubscribed: boolean;
}

declare interface IVendor extends ISumUser {}

declare interface IBranch extends ISumUser {}

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

declare interface IOrderRequestItem {
  product: IProduct;
  quantity: number;
  total: number;
  _id: string;
}

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

declare interface IRejectionReasons {
  isOutOfStock: boolean;
  isUnreachable: boolean;
  others: string;
}
