import i18n from "locales/i18n";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectAuth } from "store/auth-slice";
import { ProductActionsContainer } from "./ProductActionsContainer";
import "./ProductCard.scss";
import { ProductDetailsContainer } from "./ProductDetailsContainer";
import { ProductImageContainer } from "./ProductImageContainer";

export default function ProductCard({ product }) {
  const lang = i18n.language;

  const navigate = useNavigate();
  const popupRef = useRef(null);
  const componentRef = useRef(null);
  const { userRole } = useSelector(selectAuth);

  useEffect(() => {
    const bodyElement = document.body;
    const removePopUp = (e) => {
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
