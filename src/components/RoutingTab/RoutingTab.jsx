import classNames from "classnames";
import { t } from "i18next";
import { NavLink } from "react-router-dom";
import "./RoutingTab.scss";

export default function RoutingTab({ routes, className }) {
  return (
    <div className={classNames(className, "routing-tabs-container")}>
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
