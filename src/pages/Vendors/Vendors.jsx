import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import SearchArea from "../../components/SearchArea/SearchArea";
import VendorCard from "../../components/VendorCard/VendorCard";
import clientServices from "../../services/clientServices";
import "./Vendors.scss";
export default function Vendors() {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const params = useParams();
  const categoryId = params.categoryId;

  async function getVendorsHandler() {
    setLoading(true);
    try {
      let { data } = categoryId
        ? await clientServices.listAllVendorsInCategory(categoryId)
        : await clientServices.listAllVendors();
      setVendors(data.records);
      console.log(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  useEffect(() => {
    getVendorsHandler();
  }, []);
  return (
    <div className="vendors-page">
      <SearchArea />
      {loading ? (
        <LoadingSpinner />
      ) : vendors.length > 0 ? (
        <div className="vendors-cards-container">
          {vendors.length > 0
            ? vendors.map((vendor) => {
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
