import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import "./ClientLayout.scss";
import Home from "../../pages/Home/Home";
import Vendors from "../../pages/Vendors/Vendors";
import Branches from "../../pages/Branches/Branches";
import Branch from "../../pages/Branch/Branch";
import BranchProducts from "../../components/BranchProducts/BranchProducts";
import Offers from "../../pages/Offers/Offers";
import HotDeals from "../../pages/HotDeals/HotDeals";
import Categories from "../../pages/Categories/Categories";
import Vendor from "../../pages/Vendor/Vendor";
import AccountDetails from "../../pages/AccountDetails/AccountDetails";
import WishList from "../../pages/WishList/WishList";

export default function ClientLayout() {
  return (
    <div className="base-layout">
      <NavBar />
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
          <Route path="/wish-list" element={<WishList />} />
          <Route path="/vendors/:vendorId/:branchId" element={<Branch />}>
            <Route path="offers" element={<BranchProducts />} />
            <Route path="hot-deals" element={<BranchProducts />} />
          </Route>
          {/* <Route path="/account" element={<AccountDetails />} /> */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
