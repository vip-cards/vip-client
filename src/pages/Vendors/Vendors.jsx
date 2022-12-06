import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import SearchArea from "../../components/SearchArea/SearchArea";
import VendorCard from "../../components/VendorCard/VendorCard";
import useSearch from "../../helpers/search";
import clientServices from "../../services/clientServices";
import "./Vendors.scss";

export default function Vendors() {
  const { categoryId } = useParams();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const { renderedList, setQuery } = useSearch(
    clientServices.vendorQuery,
    vendors
  );

  async function getVendorsHandler() {
    setLoading(true);
    try {
      const { data } = categoryId
        ? await clientServices.listAllVendorsInCategory(categoryId)
        : await clientServices.listAllVendors();
      setVendors(data.records);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    getVendorsHandler();
  }, []);

  return (
    <div className="vendors-page">
      <SearchArea onChange={(e) => setQuery(e.target.value)} />
      {loading ? (
        <LoadingSpinner />
      ) : renderedList.length > 0 ? (
        <div className="vendors-cards-container">
          {renderedList.length > 0
            ? renderedList.map((vendor) => {
                return <VendorCard key={vendor._id} vendor={vendor} />;
              })
            : null}
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
}
