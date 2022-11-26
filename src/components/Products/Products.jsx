import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import clientServices from "../../services/clientServices";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NoData from "../NoData/NoData";
import ProductCard from "../ProductCard/ProductCard";
import "./Products.scss";

export default function Products() {
  const location = useLocation();
  const vendorId = useSelector((state) => state.auth.vendorId);
  const [offers, setOffers] = useState([]);
  const [Loading, setLoading] = useState(false);

  function isHotDeal() {
    if (location.pathname.includes("hot-deals")) {
      return true;
    } else {
      return false;
    }
  }

  async function getProductsHandler() {
    setLoading(true);
    try {
      const { data } = await clientServices.listAllProductsOfType(isHotDeal());
      setOffers(data.records);
      setLoading(false);
      console.log("data", data);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  useEffect(() => {
    getProductsHandler();
  }, []);

  return (
    <>
      {Loading ? (
        <LoadingSpinner />
      ) : offers.length > 0 ? (
        <div className="products-container">
          {offers?.length > 0 &&
            offers.map((offer) => {
              return <ProductCard key={offer._id} product={offer} />;
            })}
        </div>
      ) : (
        <NoData />
      )}
    </>
  );
}
