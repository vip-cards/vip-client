import React, { useEffect, useState } from "react";
import { ReactComponent as Rate } from "../../assets/VIP-ICON-SVG/rate.svg";
import "./Branch.scss";
import SearchInput from "../../components/SearchInput/SearchInput";
import { Outlet, useParams } from "react-router";
import RoutingTab from "../../components/RoutingTab/RoutingTab";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import i18n from "../../locales/i18n";
import clientServices from "../../services/clientServices";
export default function Branch() {
  const params = useParams();
  let branchId = params.branchId;
  let vendorId = params.vendorId;
  let lang = i18n.language;
  const [loading, setLoading] = useState(false);
  let routes;
  const [branchhInfo, setBranchInfo] = useState({
    name_en: "",
    name_ar: "",
    lat: "31.21417631969772",
    lng: "29.945998297003165",
    email: "",
    address_en: "",
    address_ar: "",
    phone: "",
    governorate: "",
    vendor: "",
  });

  useEffect(() => {
    getBranchDetailsHandler();
  }, []);

  console.log(branchhInfo);

  async function getBranchDetailsHandler() {
    setLoading(true);
    try {
      let { data } = await clientServices.getBranchDetails(branchId);
      setBranchInfo({
        name_en: data?.record[0]?.name?.en,
        name_ar: data?.record[0]?.name?.ar,
        lat: "31.21417631969772",
        lng: "29.945998297003165",
        email: data?.record[0]?.email,
        address_en: data?.record[0]?.address.en,
        address_ar: data?.record[0]?.address.ar,
        phone: data?.record[0]?.phone,
        governorate: data?.record[0]?.governorate.en,
        vendor: data?.record[0]?.vendor,
      });

      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  routes = [
    { name: "offers", route: `/vendors/${vendorId}/${branchId}/offers` },
    { name: "hot-deals", route: `/vendors/${vendorId}/${branchId}/hot-deals` },
  ];

  return (
    <div className="app-card-shadow branch-container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="branch-details">
          <p className="branch-name">{`${branchhInfo?.vendor?.name?.[lang]} - ${
            branchhInfo?.[`name_${lang}`]
          }`}</p>
          <div className="rate">
            <Rate className="rate-icon" />
            <Rate className="rate-icon" />
            <Rate className="rate-icon" />
            <Rate className="rate-icon" />
            <Rate className="rate-icon" />
            (653 Reviews)
          </div>
          <p className="address">{branchhInfo?.[`address_${lang}`]}</p>
        </div>
      )}
      <div className="search-input-container">
        <SearchInput />
      </div>

      <RoutingTab routes={routes} />

      <Outlet />
    </div>
  );
}
