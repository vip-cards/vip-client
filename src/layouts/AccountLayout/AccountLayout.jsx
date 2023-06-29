import { Outlet } from "react-router";
import NavItem from "../../components/NavItem/NavItem";
import {
  faBarcode,
  faHeart,
  faList,
  faLocationDot,
  faRug,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./AccountLayout.scss";
import { t } from "i18next";

export default function AccountLayout() {
  return (
    <div className="app-card-shadow edit-account-container max-sm:!m-0 max-sm:!p-3 max-sm:!rounded-none">
      <div className="account-layout-container">
        {/* TOP BAR */}
        {/* <div className="account-topbar">topbar</div> */}
        {/* SIDE BAR */}
        <nav className="account-sidebar  max-w-full overflow-hidden  overflow-x-scroll max-sm:!border-none">
          <ul className="nav-menu gap-x-1">
            <NavItem to="details" icon={faUser} title={t("accountDetails")} />
            <NavItem to="barcode" icon={faBarcode} title={t("barcode")} />

            <NavItem to="orders" icon={faList} title={t("previousOrders")} />
            <NavItem
              to="orders-requests"
              icon={faList}
              title={t("orderRequests")}
            />
            <NavItem to="wishlist" icon={faHeart} title={t("wishlist")} />
            <NavItem to="coupons" icon={faRug} title={t("coupons")} />
            <NavItem to="location" icon={faLocationDot} title={t("location")} />
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
