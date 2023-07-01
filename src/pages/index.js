import { lazy } from "react";

export const SponsorAds = lazy(() => import("./Ads/Ads"));
export const CreateAd = lazy(() => import("./Ads/CreateAd/CreateAd"));
export const PreviousAds = lazy(() => import("./Ads/PreviousAds/PreviousAds"));
export const Branch = lazy(() => import("./Branch/Branch"));
export const Branches = lazy(() => import("./Branches/Branches"));
export const Chat = lazy(() => import("./Chat/Chat"));
export const Offers = lazy(() => import("./Offers/Offers"));
export const Wishlist = lazy(() => import("./Wishlist/Wishlist"));

export const Services = lazy(() => import("./Services/Services"));
export const Subscribe = lazy(() => import("./Subscribe/Subscribe"));
export const Preview = lazy(() => import("./Preview/Preview"));

export { default as CartPage } from "./CartPage/CartPage";
export { default as Categories } from "./Categories/Categories";
export { default as Home } from "./Home/Home";
export { default as Jobs } from "./Jobs/Jobs";
export { default as ApplyJobTab } from "./Jobs/Tabs/ApplyJobTab/ApplyJobTab";
export { default as HiringEmployeeTab } from "./Jobs/Tabs/HiringEmployeeTab/HiringEmployeeTab";
export { default as HiringTabCreateJob } from "./Jobs/Tabs/HiringEmployeeTab/HiringTabCreateJob";
export { default as HiringTabHome } from "./Jobs/Tabs/HiringEmployeeTab/HiringTabHome";
export { default as HiringTabViewCreatedJobs } from "./Jobs/Tabs/HiringEmployeeTab/HiringTabViewCreatedJobs";
export { default as JobPage } from "./Jobs/views/JobPage";
export { default as ProductDetails } from "./ProductDetails/ProductDetails";
export { default as Vendor } from "./Vendor/Vendor";
export { default as VendorCategory } from "./VendorCategory/VendorCategory";
export { default as Vendors } from "./Vendors/Vendors";
