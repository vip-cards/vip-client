import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { ProductActionsContainer } from "./ProductActionsContainer";
import { ProductDetailsContainer } from "./ProductDetailsContainer";
import { ProductImageContainer } from "./ProductImageContainer";

import "./ProductCard.scss";

export default function ProductCard({ product }: { product: IProduct }) {
  const navigate = useNavigate();
  const location = useLocation();

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
        popupRef.current?.classList.add("close");
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

  // if (isLoading || error) return <LoadingProductCard />;

  if (!product?._id) return null;

  return (
    <div className="product-card" ref={componentRef}>
      <ProductImageContainer product={product} />
      <div
        className="product-info-container !h-40 !p-3"
        onClick={() => {
          navigate("/product/" + product._id);
        }}
      >
        <ProductDetailsContainer product={product} />
        {location.pathname !== "/wishlist" && (
          <ProductActionsContainer product={product} ref={popupRef} />
        )}
      </div>
    </div>
  );
}
