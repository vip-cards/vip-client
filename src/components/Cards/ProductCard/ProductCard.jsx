import { useEffect, useRef } from "react";
import { ProductActionsContainer } from "./ProductActionsContainer";
import { ProductDetailsContainer } from "./ProductDetailsContainer";
import { ProductImageContainer } from "./ProductImageContainer";
import "./ProductCard.scss";

export default function ProductCard({ product }) {

  const popupRef = useRef(null);
  const componentRef = useRef(null);

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
