import loadable from "@loadable/component";

const Adcard = loadable(() => import("./AdCard/Adcard"));
const VendorCard = loadable(() => import("./VendorCard/VendorCard"));
const BannerCard = loadable(() => import("./BannerCard/BannerCard"));
const BranchCard = loadable(() => import("./BranchCard/BranchCard"));
const OrderCard = loadable(() => import("./OrderCard/OrderCard"));
const CategoryCard = loadable(() => import("./CategoryCard/CategoryCard"));
const ProductCard = loadable(() => import("./ProductCard/ProductCard"));
const PointsCard = loadable(() => import("./PointsCard/PointsCard"));
const ReviewCard = loadable(() => import("./ReviewCard/ReviewCard"));
const ServiceCard = loadable(() => import("./ServiceCard/ServiceCard"));

export {
  Adcard,
  BannerCard,
  BranchCard,
  CategoryCard,
  OrderCard,
  ProductCard,
  ServiceCard,
  VendorCard,
  PointsCard,
  ReviewCard,
};
