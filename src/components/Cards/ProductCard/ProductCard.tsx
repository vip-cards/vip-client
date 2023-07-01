import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { ProductActionsContainer } from "./ProductActionsContainer";
import { ProductDetailsContainer } from "./ProductDetailsContainer";
import { ProductImageContainer } from "./ProductImageContainer";
import { motion } from "framer-motion";
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
    <motion.div
      layout
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 14,
      }}
      className="product-card"
      ref={componentRef}
    >
      <ProductImageContainer product={product} />
      <div
        className="product-info-container !h-40 !p-3"
        onClick={() => {
          navigate("/product/" + product._id);
        }}
      >
        <ProductDetailsContainer product={product} />
        {!location.pathname.includes("/wishlist") && (
          <ProductActionsContainer product={product} ref={popupRef} />
        )}
      </div>
    </motion.div>
  );
}
