import React from "react";
import "./ProductCard.scss";
import branchImage from "../../assets/images/productImg.png";

export default function ProductCard() {
  return (
    <div className="product-card">
      <div className="product-img-container">
        <img src={branchImage} alt="product-img" className="product-img" />
      </div>
      <div className="product-info-container">
        <p className="product-title">
          Samsung Galaxy A23 Dual SIM 64GB - 4GB Ram - Middle East Version
        </p>
        <div className="price-edit">
          <p className="price">
            55603 <span className="currency">EGP</span>
          </p>
          <button className="edit">Edit</button>
        </div>
        <div className="sale-ratio">
          <p className="sale">70000 EGP</p>
          <p className="ratio">44% OFF</p>
        </div>
        <p className="limited">limited</p>
      </div>
    </div>
  );
}
