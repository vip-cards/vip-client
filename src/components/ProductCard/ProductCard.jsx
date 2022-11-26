import React from "react";
import "./ProductCard.scss";

import i18n from "../../locales/i18n";
import { useNavigate } from "react-router";
import { t } from "i18next";
import imagesPath from "../../services/imagesPath";
import { useSelector } from "react-redux";
import productPlaceHolder from "../../assets/images/productPlaceHolder.png";

export default function ProductCard({ product }) {
  let auth = useSelector((state) => state.auth);
  const userRole = auth.userRole;

  const lang = i18n.language;
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <div className="product-img-container">
        <img
          src={`${imagesPath}${product?.image?.path}`}
          alt="product-img"
          className="product-img"
        />
      </div>
      <div className="product-info-container">
        <p className="product-title">{product.name[lang]} </p>
        <div className="price-edit">
          <p className="price">
            {product.price} <span className="currency">EGP</span>
          </p>
        </div>
        <div className="sale-ratio">
          <p className="sale">{product.originalPrice} EGP</p>
          <p className="ratio">
            {parseInt(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )}
            % OFF
          </p>
        </div>
        {product.isLimited && <p className="limited">limited</p>}
      </div>
    </div>
  );
}
