import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import vendorServices from "../../services/vendorSevices";
import ProductCard from "../ProductCard/ProductCard";
import "./BranchProducts.scss";
export default function BranchProducts() {
  const params = useParams();
  const branchId = params.branchId;
  const location = useLocation();
  const vendorId = useSelector((state) => state.auth.userId);

  function isHotDeal() {
    if (location.pathname.includes("hot-deals")) {
      return true;
    } else {
      return false;
    }
  }

  async function getBranchProductsHandler() {
    try {
      const { data } = await vendorServices.listAllBranchProductsOfType(
        vendorId,
        branchId,
        isHotDeal()
      );

      console.log("data", data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getBranchProductsHandler();
  }, []);

  console.log("branch routing", params, location);
  return (
    <div className="branch-products-container">
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  );
}
