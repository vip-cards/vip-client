declare interface IProduct {
  _id: string;
  name: ILocalizedString;
  vendor: IVendor;
  branches: IBranch[];
  category: Omit<IProductCategory, "image">; // this response do not include image
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
}
