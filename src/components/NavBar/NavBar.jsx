import React, { useState } from "react";

import { t } from "i18next";
import { ReactComponent as NavbarLogo } from "../../assets/VIP-ICON-SVG/NavbarLogo.svg";
import { ReactComponent as Notification } from "../../assets/VIP-ICON-SVG/notification.svg";
import { ReactComponent as BurgerMenuIcon } from "../../assets/VIP-ICON-SVG/burgerMenu.svg";

import "./NavBar.scss";
import i18n from "../../locales/i18n";
import { switchLang } from "../../helpers/lang";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import SideNAv from "./SideNAv/SideNAv";

export default function NavBar() {
  const navigate = useNavigate();
  const [viweAccountMenu, setViweAccountMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const dispatch = useDispatch();

  const lang = i18n.language;

  const navItems = [
    { link: "/home", title: "home" },
    { link: "/categories", title: "categories" },
    { link: "/vendors", title: "vendors" },
    { link: "/hot-deals", title: "hotDeals" },
    { link: "/offers", title: "offers" },
    { link: "/jobs", title: "jobs" },
    { link: "/wishlist", title: "wishlist" },
    { link: "/account", title: "myAccount" },
    {
      link: "/logout",
      title: "logout",
      onClick: (e) => {
        logoutHandler(e);
      },
    },
  ];

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
    localStorage.removeItem("userData");
    dispatch(authActions.logout());
    setViweAccountMenu((prevState) => !prevState);
  }

  return (
    <nav className="top-nav">
      <BurgerMenuIcon className="burger-menu-icon" onClick={toggleSideMenu} />
      <NavbarLogo
        className="app-logo"
        onClick={() => {
          navigate("/");
        }}
      />
      <ul className="nav-menu">
        {navItems.map((item, idx) => (
          <li key={idx} className="nav-item">
            <NavLink
              to={item.link}
              className={(navData) =>
                navData.isActive ? "active nav-link" : "nav-link"
              }
              onClick={item.onClick}
            >
              {t(item.title)}
            </NavLink>
          </li>
        ))}
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
      {showSideMenu && <SideNAv onToggle={toggleSideMenu} items={navItems} />}
    </nav>
  );
}
