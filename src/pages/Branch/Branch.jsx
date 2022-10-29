import React, { useEffect } from "react";
import { ReactComponent as Rate } from "../../assets/VIP-ICON-SVG/rate.svg";
import "./Branch.scss";
import SearchInput from "../../components/SearchInput/SearchInput";
import { Outlet, useParams } from "react-router";
import RoutingTab from "../../components/RoutingTab/RoutingTab";
export default function Branch() {
  const params = useParams();
  const branchId = params.branchId;

  useEffect(() => {}, []);

  console.log("params", params);

  return (
    <div className="app-card-shadow branch-container">
      <div className="branch-details">
        <p className="branch-name">Samsung - Miamie Branch</p>
        <div className="rate">
          <Rate className="rate-icon" />
          <Rate className="rate-icon" />
          <Rate className="rate-icon" />
          <Rate className="rate-icon" />
          <Rate className="rate-icon" />
          (653 Reviews)
        </div>
        <p className="address">532 gamal abdelnaser - front elmahdy phamacy</p>
      </div>
      <div className="search-input-container">
        <SearchInput />
      </div>

      <RoutingTab
        routes={[
          { name: "offers", route: `/branches/${branchId}/offers` },
          { name: "hot-deals", route: `/branches/${branchId}/hot-deals` },
        ]}
      />

      <Outlet />
    </div>
  );
}
