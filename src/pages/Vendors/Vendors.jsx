import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import SearchArea from "../../components/SearchArea/SearchArea";
import VendorCard from "../../components/VendorCard/VendorCard";
import clientServices from "../../services/clientServices";
import "./Vendors.scss";
export default function Vendors() {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);

  async function getVendorsHandler() {
    setLoading(true);
    try {
      let { data } = await clientServices.listAllVendors();
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
      ) : (
        <div className="vendors-cards-container">
          {vendors.length > 0
            ? vendors.map((vendor) => {
                return <VendorCard key={vendor._id} vendor={vendor} />;
              })
            : null}
        </div>
      )}
    </div>
  );
}
