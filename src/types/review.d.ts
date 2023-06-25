declare interface IReview {
  _id: string;
  client: {
    _id: string;
    name: ILocalizedString;
  };
  vendor: {
    _id: string;
    name: ILocalizedString;
    rate: number;
    image: IImage;
  };
  product: {
    _id: string;
    name: ILocalizedString;
    image: IImage[];
    rate: number;
  };
}
