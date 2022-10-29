import { t } from "i18next";
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import "./RoutingTab.scss";
export default function RoutingTab({ routes }) {
  const params = useParams();
  const branchId = params.branchId;
  console.log("routing params", params);
  return (
    <div className="routing-tabs-container">
      <div className="tab-route">
        <NavLink
          to={routes[0].route}
          className={(navData) =>
            navData.isActive ? "active tab-link" : "tab-link"
          }
        >
          {t(routes[0].name)}
        </NavLink>
      </div>
      <div className="tab-route">
        <NavLink
          to={routes[1].route}
          className={(navData) =>
            navData.isActive ? "active tab-link" : "tab-link"
          }
        >
          {t(routes[1].name)}
        </NavLink>
      </div>
    </div>
  );
}
