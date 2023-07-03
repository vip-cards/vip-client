interface IProductCategory {
  _id: string;
  image?: IImage;
  name: ILocalizedString;
}

declare interface IVendor {
  __v: number;
  _id: string;

  name: ILocalizedString;
  email: string;
  password: string;
  phone: string;
  image?: IImage;
  cover?: IImage;

  description: ILocalizedString;
  category: Omit<IProductCategory, "image">; // image is not included in the response

  rate: number;
  rank: number;
  numOfReviews: number;

  isActive: boolean;
  hasDelivery: boolean;
  hasOnlinePayment: boolean;

  role: string;
  link?: string;
  productCategories: IProductCategory[];
  joinDate: Date;
}
