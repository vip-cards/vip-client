import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import clientServices from "../../services/clientServices";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./BranchProducts.scss";
import { ProductCard } from "components/Cards";

export default function BranchProducts() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const vendorId = params.vendorId;
  const branchId = params.branchId;

  const [loading, setLoading] = useState(false);
  const [branchProducts, setBranchProducts] = useState([]);

  function isHotDeal() {
    return !!location.pathname.includes("hot-deals");
  }

  async function getBranchProductsHandler() {
    try {
      setLoading(true);
      const { data } = await clientServices.listAllBranchProductsOfType(
        branchId,
        isHotDeal()
      );

      setBranchProducts(data.records);

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      getBranchProductsHandler();
    } catch (e) {}
  }, [location.pathname]);

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
