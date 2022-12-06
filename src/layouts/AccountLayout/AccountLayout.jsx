import { Outlet } from "react-router";
import NavItem from "../../components/NavItem/NavItem";
import { faHeart, faList, faUser } from "@fortawesome/free-solid-svg-icons";
import "./AccountLayout.scss";
import { t } from "i18next";

export default function AccountLayout() {
  return (
    <div className="app-card-shadow edit-account-container">
      <div className="account-layout-container">
        {/* TOP BAR */}
        {/* <div className="account-topbar">topbar</div> */}
        {/* SIDE BAR */}
        <nav className="account-sidebar">
          <ul className="nav-menu">
            <NavItem to="details" icon={faUser} title={t("accountDetails")} />
            <NavItem to="orders" icon={faList} title={t("previousOrders")} />
            <NavItem to="wishlist" icon={faHeart} title={t("wishlist")} />
          </ul>
        </nav>
        {/* CONTENT */}
        <div className="account-outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
