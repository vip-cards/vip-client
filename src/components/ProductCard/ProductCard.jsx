import React, { useEffect, useRef } from "react";
import "./ProductCard.scss";

import i18n from "../../locales/i18n";
import { useNavigate } from "react-router";
import { t } from "i18next";

import { useSelector } from "react-redux";

import { ProductImageContainer } from "./ProductImageContainer";
import { ProductDetailsContainer } from "./ProductDetailsContainer";
import { ProductActionsContainer } from "./ProductActionsContainer";

export default function ProductCard({ product }) {
  const lang = i18n.language;

  const navigate = useNavigate();
  const popupRef = useRef(null);
  const componentRef = useRef(null);
  const { userRole } = useSelector((state) => state.auth);

  useEffect(() => {
    const bodyElement = document.body;
    const removePopUp = (e) => {
      console.log(e.target);
      if (
        componentRef.current &&
        !componentRef.current.contains(e.target) &&
        !e.target.matches(".branch-item")
      ) {
        popupRef.current && popupRef.current.classList.add("close");
      } else {
        return;
      }
    };
    console.log(bodyElement);
    bodyElement.addEventListener(
      "ontouchstart" in window ? "touchstart" : "click",
      removePopUp
    );

    return () => {
      bodyElement.removeEventListener(
        "ontouchstart" in window ? "touchstart" : "click",
        removePopUp
      );
    };
  }, []);

  return (
    <div className="product-card" ref={componentRef}>
      <ProductImageContainer product={product} />
      <div className="product-info-container">
        <ProductDetailsContainer product={product} />
        <ProductActionsContainer product={product} ref={popupRef} />
      </div>
    </div>
  );
}
