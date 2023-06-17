import { useEffect, useRef } from "react";
import useSWR from "swr";
import { ProductActionsContainer } from "./ProductActionsContainer";
import "./ProductCard.scss";
import { ProductDetailsContainer } from "./ProductDetailsContainer";
import { ProductImageContainer } from "./ProductImageContainer";
import clientServices from "services/clientServices";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import CardContainer from "components/CardContainer/CardContainer";
import LoadingProductCard from "./LoadingProductCard";

export default function ProductCard({ product: { _id: productId } }) {
  const { data, error, isLoading } = useSWR(
    `product-details-${productId}`,
    () => clientServices.getProductDetails(productId)
  );

  const product = data?.record?.[0];

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

  if (isLoading || error) return <LoadingProductCard />;

  if (!product?._id) return null;

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
