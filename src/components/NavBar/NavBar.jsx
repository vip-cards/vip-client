import React, { useState } from "react";

import { t } from "i18next";
import { ReactComponent as NavbarLogo } from "../../assets/VIP-ICON-SVG/NavbarLogo.svg";
import { ReactComponent as Notification } from "../../assets/VIP-ICON-SVG/notification.svg";
import { ReactComponent as BurgerMenuIcon } from "../../assets/VIP-ICON-SVG/burgerMenu.svg";

import "./NavBar.scss";
import i18n from "../../locales/i18n";
import { switchLang } from "../../helpers/lang";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth-slice";
import SideNAv from "./SideNAv/SideNAv";

export default function NavBar() {
  const [viweAccountMenu, setViweAccountMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  let auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const lang = i18n.language;

  function toggleSideMenu() {
    setShowSideMenu((prevState) => !prevState);
  }

  function changeLang(lang) {
    i18n.changeLanguage(lang);
    switchLang(lang);
  }

  function logoutHandler(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    dispatch(authActions.logout());
    setViweAccountMenu((prevState) => !prevState);
  }

  return (
    <nav className="top-nav">
      <BurgerMenuIcon className="burger-menu-icon" onClick={toggleSideMenu} />
      <NavbarLogo className="app-logo" />
      <ul className="nav-menu">
        <li className="nav-item">
          <NavLink
            to="/home"
            className={(navData) =>
              navData.isActive ? "active nav-link" : "nav-link"
            }
          >
            {t("home")}
          </NavLink>
        </li>
        <li className="nav-item">
          {" "}
          <NavLink
            to="/categories"
            className={(navData) =>
              navData.isActive ? "active nav-link" : "nav-link"
            }
          >
            {t("categories")}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/vendors"
            className={(navData) =>
              navData.isActive ? "active nav-link" : "nav-link"
            }
          >
            {t("vendors")}
          </NavLink>
        </li>
        <li className="nav-item">
          {" "}
          <NavLink
            to="/hot-deals"
            className={(navData) =>
              navData.isActive ? "active nav-link" : "nav-link"
            }
          >
            {t("hotDeals")}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/offers"
            className={(navData) =>
              navData.isActive ? "active nav-link" : "nav-link"
            }
          >
            {t("offers")}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/jobs"
            className={(navData) =>
              navData.isActive ? "active nav-link" : "nav-link"
            }
          >
            {t("jobs")}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/account"
            className={(navData) =>
              navData.isActive ? "active nav-link" : "nav-link"
            }
          >
            {t("myAccount")}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/logout"
            onClick={(e) => {
              logoutHandler(e);
            }}
            className={(navData) =>
              navData.isActive ? "active nav-link" : "nav-link"
            }
          >
            {t("logout")}
          </NavLink>
        </li>
      </ul>

      <div className="notifictation-language">
        <button
          className="lang-btn"
          onClick={
            lang === "en"
              ? () => {
                  changeLang("ar");
                }
              : () => {
                  changeLang("en");
                }
          }
        >
          {t("lang")}
        </button>
        <Notification className="notification-icon" />
      </div>
      <Notification className="small-notification-icon" />
      {showSideMenu && <SideNAv />}
    </nav>
  );
}
