import { Navigate, Route, Routes } from "react-router-dom";

import AccountLayout from "../AccountLayout/AccountLayout";

import Home from "../../pages/Home/Home";
import Vendors from "../../pages/Vendors/Vendors";
import Branches from "../../pages/Branches/Branches";
import Branch from "../../pages/Branch/Branch";
import BranchProducts from "../../components/BranchProducts/BranchProducts";
import Offers from "../../pages/Offers/Offers";
import HotDeals from "../../pages/HotDeals/HotDeals";
import Categories from "../../pages/Categories/Categories";
import Vendor from "../../pages/Vendor/Vendor";
import Wishlist from "../../pages/Wishlist/Wishlist";

import AccountDetails from "../../views/AccountDetails/AccountDetails";
import AccountOrders from "../../views/AccountOrders/AccountOrders";
import AccountWishlist from "../../views/AccountWishlist/AccountWishlist";

import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

import "./ClientLayout.scss";
import VendorCategory from "../../pages/VendorCategory/VendorCategory";
import CartPage from "../../pages/CartPage/CartPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentCartThunk } from "../../store/cart-slice";
import AccountBarcode from "../../views/AccountBarcode/AccountBarcode";
import ProductDetails from "../../pages/ProductDetails/ProductDetails";
import Jobs from "../../pages/Jobs/Jobs";
import ApplyJobTab from "../../pages/Jobs/Tabs/ApplyJobTab/ApplyJobTab";
import HiringEmployeeTab from "../../pages/Jobs/Tabs/HiringEmployeeTab/HiringEmployeeTab";
import HiringTabHome from "../../pages/Jobs/Tabs/HiringEmployeeTab/HiringTabHome";
import HiringTabViewCreatedJobs from "../../pages/Jobs/Tabs/HiringEmployeeTab/HiringTabViewCreatedJobs";
import HiringTabCreateJob from "../../pages/Jobs/Tabs/HiringEmployeeTab/HiringTabCreateJob";
import JobPage from "../../pages/Jobs/views/JobPage";
import SponsorAds from "pages/Ads/Ads";
import CreateAd from "pages/Ads/CreateAd/CreateAd";
import PreviousAds from "pages/Ads/PreviousAds/PreviousAds";
import Chat from "pages/Chat/Chat";

export default function ClientLayout() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentCartThunk());

    return () => {};
  }, []);

  return (
    <div className="base-layout">
      <Navbar />
      <div className="base-nav-item"></div>
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/*" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/hot-deals" element={<Offers isHotDeal />} />
          <Route path="/ads" element={<SponsorAds />} />
          <Route path="/ads/create" element={<CreateAd />} />
          <Route path="/ads/list" element={<PreviousAds />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/jobs" element={<Jobs />}>
            <Route path=":id" element={<JobPage />} />
            <Route path="apply" element={<ApplyJobTab />}></Route>
            <Route path="hire" element={<HiringEmployeeTab />}>
              <Route path="home" element={<HiringTabHome />} />
              <Route path="create" element={<HiringTabCreateJob />} />
              <Route
                path="view-created"
                element={<HiringTabViewCreatedJobs />}
              />
              <Route path="" element={<Navigate to="home" />} />
            </Route>
            <Route path="" element={<Navigate to="apply" />} />
          </Route>

          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryId" element={<Vendors />} />

          <Route path="/vendors/:vendorId" element={<Vendor />} />
          <Route path="/vendors/:vendorId/branches" element={<Branches />} />
          <Route path="/vendors/:vendorId/:branchId" element={<Branch />}>
            <Route path="offers" element={<BranchProducts />} />
            <Route path="hot-deals" element={<BranchProducts />} />
            <Route path="" element={<Navigate to="offers" />} />
          </Route>
          <Route
            path="/vendors/:vendorId/category/:categoryId"
            element={<VendorCategory />}
          />
          <Route path="/product/:productId" element={<ProductDetails />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/account" element={<AccountLayout />}>
            <Route index path="details" element={<AccountDetails />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="wishlist" element={<AccountWishlist />} />
            <Route path="barcode" element={<AccountBarcode />} />
            <Route path="" element={<Navigate to="details" />} />
          </Route>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
