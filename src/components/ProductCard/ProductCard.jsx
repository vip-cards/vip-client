import React, { useEffect } from "react";
import "./ProductCard.scss";

import i18n from "../../locales/i18n";
import { useNavigate } from "react-router";
import { t } from "i18next";

import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  addWishProduct,
  fetchWishList,
  removeWishProduct,
} from "../../store/wishlist-slice";
import WishIcon from "../WishIcon/WishIcon";
import toastPopup from "../../helpers/toastPopup";
import { useState } from "react";

export default function ProductCard({ product }) {
  const lang = i18n.language;
  const auth = useSelector((state) => state.auth);
  const wishListIds = useSelector((state) => state.wishList.ids);
  const [disabled, setDisabled] = useState(false);
  const userRole = auth.userRole;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  function toggleWishList() {
    setDisabled(true);

    if (wishListIds.includes(product._id)) {
      dispatch(removeWishProduct(product._id)).then(() => {
        setDisabled(false);
      });
    } else {
      dispatch(addWishProduct(product._id)).then(() => {
        setDisabled(false);
      });
    }
    // toastPopup.success("added");
  }

  return (
    <div className="product-card">
      <div className="product-img-container">
        <img
          src={`${product?.image?.Location}`}
          alt="product-img"
          className="product-img"
        />
      </div>
      <div className="product-info-container">
        <WishIcon
          wished={wishListIds.includes(product._id)}
          disabled={disabled}
          onClick={toggleWishList}
        />

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
