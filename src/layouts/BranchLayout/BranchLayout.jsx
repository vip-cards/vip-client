import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import BranchProducts from "../../components/BranchProducts/BranchProducts";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";

import AddOffer from "../../pages/AddOffer/AddOffer";
import Branch from "../../pages/Branch/Branch";
import EditOffer from "../../pages/EditOffer/EditOffer";
import HotDeals from "../../pages/HotDeals/HotDeals";
import Offers from "../../pages/Offers/Offers";
import "./BranchLayout.scss";

export default function BranchLayout() {
  return (
    <div className="base-layout">
      <NavBar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate replace to={`/home/offers`} />} />
          <Route path="/add-offer" element={<AddOffer isHotDeal={false} />} />
          <Route path="/add-hot-deal" element={<AddOffer isHotDeal={true} />} />
          <Route
            path="/edit-offer/:offerId/:branchId"
            element={<EditOffer />}
          />
          <Route path="/home" element={<Branch />}>
            <Route index path="offers" element={<BranchProducts />} />
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
