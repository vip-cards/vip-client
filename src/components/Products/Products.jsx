import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import vendorServices from "../../services/vendorSevices";
import ProductCard from "../ProductCard/ProductCard";
import "./Products.scss";

export default function Products() {
  const location = useLocation();
  const vendorId = useSelector((state) => state.auth.userId);

  function isHotDeal() {
    if (location.pathname.includes("hot-deals")) {
      return true;
    } else {
      return false;
    }
  }

  async function getVendorProductsHandler() {
    try {
      const { data } = await vendorServices.listAllVendorProductsOfType(
        vendorId,
        isHotDeal()
      );

      console.log("data", data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getVendorProductsHandler();
  }, []);

  return (
    <div className="products-container">
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  );
}
