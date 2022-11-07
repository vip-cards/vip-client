import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import clientServices from "../../services/clientServices";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ProductCard from "../ProductCard/ProductCard";
import "./BranchProducts.scss";
export default function BranchProducts() {
  const params = useParams();
  console.log("braaaaaaaanchhhhh products");
  const navigate = useNavigate();
  const location = useLocation();

  const vendorId = params.vendorId;
  const branchId = params.branchId;

  const [loading, setLoading] = useState(false);
  const [branchProducts, setBranchProducts] = useState([]);

  function isHotDeal() {
    if (location.pathname.includes("hot-deals")) {
      return true;
    } else {
      return false;
    }
  }

  async function getBranchProductsHandler() {
    console.log("user is vendor");
    try {
      setLoading(true);
      const { data } = await clientServices.listAllBranchProductsOfType(
        branchId,
        isHotDeal()
      );

      setBranchProducts(data.records);

      setLoading(false);
      console.log("data", data);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("inside use effect");
    try {
      getBranchProductsHandler();
    } catch (e) {
      console.log(e);
    }
  }, [location.pathname]);

  console.log("branch routing", params, location);
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="branch-products-container">
          {branchProducts.length > 0
            ? branchProducts.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })
            : null}
        </div>
      )}
    </>
  );
}
