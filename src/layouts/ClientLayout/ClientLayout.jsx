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
import NavBar from "../../components/NavBar/NavBar";

import "./ClientLayout.scss";
import VendorCategory from "../../pages/VendorCategory/VendorCategory";

export default function ClientLayout() {
  return (
    <div className="base-layout">
      <NavBar />
      <div className="base-nav-item"></div>
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/*" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/offers" element={<Offers />} />

          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryId" element={<Vendors />} />

          <Route path="/hot-deals" element={<HotDeals />} />

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
          ></Route>

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/account" element={<AccountLayout />}>
            <Route index path="details" element={<AccountDetails />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="wishlist" element={<AccountWishlist />} />
            <Route path="" element={<Navigate to="details" />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
