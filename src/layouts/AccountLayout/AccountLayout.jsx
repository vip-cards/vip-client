import { Outlet } from "react-router";
import NavItem from "../../components/NavItem/NavItem";
import { faHeart, faList, faUser } from "@fortawesome/free-solid-svg-icons";
import "./AccountLayout.scss";

export default function AccountLayout() {
  return (
    <div className="app-card-shadow edit-account-container">
      <div className="account-layout-container">
        {/* TOP BAR */}
        {/* <div className="account-topbar">topbar</div> */}
        {/* SIDE BAR */}
        <nav className="account-sidebar">
          <ul className="nav-menu">
            <NavItem to="details" icon={faUser} title="Account Info" />
            <NavItem to="orders" icon={faList} title="Previous Orders" />
            <NavItem to="wish-list" icon={faHeart} title="Wish List" />
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
