import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import useSearch from "../../helpers/search";
import clientServices from "../../services/clientServices";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NoData from "../NoData/NoData";
import ProductCard from "../ProductCard/ProductCard";
import SearchArea from "../SearchArea/SearchArea";
import "./Products.scss";

export default function Products() {
  const location = useLocation();
  const [offers, setOffers] = useState([]);
  const [Loading, setLoading] = useState(false);
  const { renderedList, setQuery, setParams } = useSearch(
    clientServices.searchOffersDeals,
    offers
  );
  function isHotDeal() {
    if (location.pathname.includes("hot-deals")) {
      setParams({ isHotDeal: true });
      return true;
    } else {
      setParams({ isHotDeal: false });
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
      <SearchArea onChange={(e) => setQuery(e.target.value)} />
      {Loading ? (
        <LoadingSpinner />
      ) : renderedList.length > 0 ? (
        <div className="products-container">
          {renderedList?.length > 0 &&
            renderedList.map((offer) => {
              return <ProductCard key={offer._id} product={offer} />;
            })}
        </div>
      ) : (
        <NoData />
      )}
    </>
  );
}
