import React from "react";
import Products from "../../components/Products/Products";
import SearchArea from "../../components/SearchArea/SearchArea";
import "./HotDeals.scss";
export default function HotDeals() {
  return (
    <div className="hot-deals-page">
      <SearchArea />
      <Products />
    </div>
  );
}
