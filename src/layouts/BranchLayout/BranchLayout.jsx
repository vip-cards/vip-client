import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BranchProducts from "../../components/BranchProducts/BranchProducts";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import Branch from "../../pages/Branch/Branch";
import Branches from "../../pages/Branches/Branches";
import HotDeals from "../../pages/HotDeals/HotDeals";
import Offers from "../../pages/Offers/Offers";
import "./VendorLayout.scss";

export default function BranchLayout() {
  return (
    <div className="base-layout">
      <NavBar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate replace to="/branches" />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/branches/:branchId" element={<Branch />}>
            <Route path="offers" element={<BranchProducts />} />
            <Route path="hot-deals" element={<BranchProducts />} />
          </Route>
          <Route path="/offers" element={<Offers />} />
          <Route path="/hot-deals" element={<HotDeals />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
