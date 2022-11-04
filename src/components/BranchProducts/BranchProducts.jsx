import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import branchServices from "../../services/branchServices";
import vendorServices from "../../services/vendorServices";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ProductCard from "../ProductCard/ProductCard";
import "./BranchProducts.scss";
export default function BranchProducts() {
  const params = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  const userRole = auth.userRole;
  const vendorId = auth.vendorId;
  const branchId = userRole === "vendor" ? params.branchId : auth.branchId;

  const [loading, setLoading] = useState(false);
  const [branchProducts, setBranchProducts] = useState([]);

  function isHotDeal() {
    if (location.pathname.includes("hot-deals")) {
      return true;
    } else {
      return false;
    }
  }

  async function vendorBranchProducts() {
    const { data } = await vendorServices.listAllBranchProductsOfType(
      vendorId,
      branchId,
      isHotDeal()
    );

    return data;
  }

  async function getBranchProducts() {
    const { data } = await branchServices.listAllBranchProductsOfType(
      branchId,
      isHotDeal()
    );

    return data;
  }

  async function getBranchProductsHandler() {
    let data;

    console.log("user is vendor");
    try {
      setLoading(true);
      if (userRole === "vendor") {
        data = await vendorBranchProducts();
        setBranchProducts(data.records);
      } else if (userRole === "branch") {
        data = await getBranchProducts();
        setBranchProducts(data.records);
      }
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
        <>
          <div className="add-button-container">
            <button
              className="add-button"
              onClick={() => {
                isHotDeal()
                  ? navigate(`/add-hot-deal/${branchId}`)
                  : navigate(`/add-offer/${branchId}`);
              }}
            >
              {isHotDeal() ? t("addHotDeal") : t("addOffer")}
            </button>
          </div>
          <div className="branch-products-container">
            {branchProducts.length > 0
              ? branchProducts.map((product) => {
                  return <ProductCard key={product._id} product={product} />;
                })
              : null}
          </div>
        </>
      )}
    </>
  );
}

//  <i className="fas fa-spinner fa-spin "></i>
