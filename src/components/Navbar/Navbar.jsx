import React, { useEffect, useState } from "react";

import { t } from "i18next";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ReactComponent as BurgerMenuIcon } from "../../assets/VIP-ICON-SVG/burgerMenu.svg";
import { ReactComponent as NavbarLogo } from "../../assets/VIP-ICON-SVG/NavbarLogo.svg";
import { ReactComponent as Notification } from "../../assets/VIP-ICON-SVG/notification.svg";
import { switchLang } from "../../helpers/lang";
import i18n from "../../locales/i18n";
import clientServices from "../../services/clientServices";
import { authActions } from "../../store/auth-slice";
import Dropdown from "../DropDown/DropDown";
import "./Navbar.scss";
import SideNav from "./SideNav/SideNav";

export default function Navbar() {
  const navigate = useNavigate();

  const [lists, setLists] = useState({});
  const [viweAccountMenu, setViweAccountMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const dispatch = useDispatch();

  const lang = i18n.language;

  const setListItem = (item) => {
    setLists((list) => ({ ...list, ...item }));
  };

  const navItems = [
    { link: "/home", title: "home" },
    {
      link: "/categories",
      title: "categories",
    },
    { link: "/vendors", title: "vendors" },
    { link: "/hot-deals", title: "hotDeals" },
    { link: "/offers", title: "offers" },
    { link: "/jobs", title: "jobs" },
    { link: "/wishlist", title: "wishlist" },
    { link: "/cart", title: "cart" },
    { link: "/ads", title: "ads" },
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

  useEffect(() => {
    clientServices.categoryQuery().then((response) => {
      const categoryList = response.data.records.map((item) => ({
        key: item._id,
        _id: item._id,
        to: "categories/" + item._id,
        content: item.name[lang] || item.name.en || item.name.ar,
      }));

      setListItem({ categories: categoryList });
    });
    clientServices.vendorQuery().then((response) => {
      const vendorList = response.data.records.map((item) => ({
        key: item._id,
        _id: item._id,
        to: "vendors/" + item._id,
        content: item.name[lang] || item.name.en || item.name.ar,
      }));

      setListItem({ vendors: vendorList });
    });
    return () => {};
  }, []);

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
            <Dropdown menu={lists[item.title] || undefined}>
              <NavLink
                to={item.link}
                className={(navData) =>
                  navData.isActive ? "active nav-link" : "nav-link"
                }
                onClick={item.onClick}
              >
                {t(item.title)}
              </NavLink>
            </Dropdown>
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
      {showSideMenu && <SideNav onToggle={toggleSideMenu} items={navItems} />}
    </nav>
  );
}
