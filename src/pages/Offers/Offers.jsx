import React from "react";
import Products from "../../components/Products/Products";
import SearchArea from "../../components/SearchArea/SearchArea";
import "./Offers.scss";
export default function Offers() {
  return (
    <div className="offers-page">
      <SearchArea />
      <Products />
    </div>
  );
}
