import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import vendorServices from "../../services/vendorServices";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ProductCard from "../ProductCard/ProductCard";
import "./Products.scss";

export default function Products() {
  const location = useLocation();
  const vendorId = useSelector((state) => state.auth.vendorId);
  const [vendorOffers, setVendorOffers] = useState([]);
  const [Loading, setLoading] = useState(false);

  function isHotDeal() {
    if (location.pathname.includes("hot-deals")) {
      return true;
    } else {
      return false;
    }
  }

  async function getVendorProductsHandler() {
    setLoading(true);
    try {
      const { data } = await vendorServices.listAllVendorProductsOfType(
        vendorId,
        isHotDeal()
      );

      setVendorOffers(data.records);
      setLoading(false);
      console.log("data", data);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  useEffect(() => {
    getVendorProductsHandler();
  }, []);

  return (
    <>
      {Loading ? (
        <LoadingSpinner />
      ) : (
        <div className="products-container">
          {vendorOffers?.length > 0 &&
            vendorOffers.map((offer) => {
              return <ProductCard key={offer._id} product={offer} />;
            })}
        </div>
      )}
    </>
  );
}
