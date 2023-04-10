import { useEffect, useState } from "react";

import classNames from "classnames";
import { ROUTES } from "constants/routes";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { markAsSeen } from "services/socket/notification";
import { selectNotification } from "store/notification-slice";
import { ReactComponent as NavbarLogo } from "../../assets/VIP-ICON-SVG/NavbarLogo.svg";
import { ReactComponent as BurgerMenuIcon } from "../../assets/VIP-ICON-SVG/burgerMenu.svg";
import { ReactComponent as Notification } from "../../assets/VIP-ICON-SVG/notification.svg";
import { switchLang } from "../../helpers/lang";
import i18n from "../../locales/i18n";
import clientServices from "../../services/clientServices";
import { authActions } from "../../store/auth-slice";
import Dropdown from "../DropDown/DropDown";
import SideNav from "./SideNav/SideNav";

import "./Navbar.scss";

export default function Navbar() {
  const navigate = useNavigate();

  const [lists, setLists] = useState({});
  const [viweAccountMenu, setViweAccountMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const notificationList = useSelector(selectNotification);

  const dispatch = useDispatch();

  const lang = i18n.language;

  const setListItem = (item) => {
    setLists((list) => ({ ...list, ...item }));
  };

  const navItems = [
    { link: ROUTES.HOME, title: "home" },
    { link: ROUTES.CATEGORIES, title: "categories" },
    { link: ROUTES.VENDORS, title: "vendors" },
    { link: ROUTES.HOT_DEALS, title: "hotDeals" },
    { link: `/${ROUTES.OFFERS}`, title: "offers" },
    { link: `/${ROUTES.JOBS.MAIN}`, title: "jobs" },
    { link: `/${ROUTES.WISHLIST}`, title: "wishlist" },
    { link: `/${ROUTES.CART}`, title: "cart" },
    { link: `/${ROUTES.ADS.MAIN}`, title: "ads" },
    { link: "/services", title: "service" },
    { link: `/${ROUTES.CHAT}`, title: "chat" },
    { link: `/${ROUTES.ACCOUNT}`, title: "myAccount" },
    {
      link: `/${ROUTES.LOGOUT}`,
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

  function handleNotificationClick(notificationId, link) {
    markAsSeen(notificationId);
  }

  const NofificationRing = () => (
    <Dropdown
      className="ml-auto lg:ml-0"
      menu={notificationList.list}
      left
      listRender={(menu) =>
        menu
          .filter((item) => !item.seen)
          .slice(0, 10)
          .map((item, idx) => (
            <li
              key={item._id}
              className={classNames("relative cursor-pointer px-3 py-5", {
                "bg-slate-100/40 border-0 border-b-2 border-b-slate-300/40":
                  !item.seen,
              })}
              onClick={() => handleNotificationClick(item._id, item.link)}
            >
              {!item.seen && (
                <span className="ml-auto absolute w-2 h-2 bg-primary rounded-full right-2 top-2 animate-pulse"></span>
              )}
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.text.slice(0, 30) +
                  (item.text.length > 30 ? "..." : "") ?? "No text"}
              </a>
            </li>
          ))
      }
    >
      {!!notificationList.list.filter((item) => !item.seen).length && (
        <div className="h-2 w-2 bg-green-500 absolute right-0 top-0 animate-fade-pulse rounded-full"></div>
      )}
      <Notification className="notification-icon" />
    </Dropdown>
  );

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
            <Dropdown
              menu={lists[item.title] || undefined}
              listRender={(menu) => (
                <>
                  {menu.slice(0, 5).map((subItem, idx) => (
                    <li key={subItem.key || "menu-item-" + idx}>
                      <Link to={subItem.to || ""}>
                        {subItem.content || "Menu Item"}
                      </Link>
                    </li>
                  ))}

                  {menu.length > 5 && (
                    <li>
                      <Link to={item.link || ""}>See All ...</Link>
                    </li>
                  )}
                </>
              )}
            >
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
      </div>
      <NofificationRing />
      {/* <NofificationRing /> */}
      {showSideMenu && <SideNav onToggle={toggleSideMenu} items={navItems} />}
    </nav>
  );
}
