import { useCallback, useEffect, useState } from "react";

import { ReactComponent as NavbarLogo } from "assets/VIP-ICON-SVG/NavbarLogo.svg";
import { ReactComponent as BurgerMenuIcon } from "assets/VIP-ICON-SVG/burgerMenu.svg";
import { ReactComponent as Notification } from "assets/VIP-ICON-SVG/notification.svg";
import classNames from "classnames";
import { ROUTES } from "constants/routes";
import { switchLang } from "helpers/lang";
import { t } from "i18next";
import i18n from "locales/i18n";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import clientServices from "services/clientServices";
import { markAsSeen } from "services/socket/notification";
import { selectNotification } from "store/notification-slice";
import Dropdown from "../DropDown/DropDown";
import SideNav from "./SideNav/SideNav";

import { logout } from "store/actions";
import { selectCartProducts } from "store/cart-slice";
import "./Navbar.scss";

export default function Navbar() {
  const navigate = useNavigate();

  const [lists, setLists] = useState({});
  const [viweAccountMenu, setViweAccountMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const notificationList = useSelector(selectNotification);
  const cartProducts = useSelector(selectCartProducts);

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
    { link: `/${ROUTES.SERVICES}`, title: "services" },
    { link: `/${ROUTES.WISHLIST}`, title: "wishlist" },
    {
      link: `/${ROUTES.CART}`,
      title: "cart",
      render: (children) => (
        <div className="relative">
          {!!cartProducts.length && (
            <div className="h-5 p-1 w-5 bg-secondary text-white absolute -right-1 ring-primary ring-2 -top-3 flex justify-center items-center rounded-full text-xs">
              {cartProducts.length}
            </div>
          )}
          {children}
        </div>
      ),
    },
    { link: `/${ROUTES.ADS.MAIN}`, title: "Ads" },

    { link: `/${ROUTES.CHAT}`, title: "chat" },
    { link: `/${ROUTES.ACCOUNT}`, title: "myAccount" },
    { link: `/${ROUTES.SUBSCRIBE}`, title: "VIP premium" },
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
    logout();
    setViweAccountMenu((prevState) => !prevState);
  }

  function handleNotificationClick(notificationId, link) {
    markAsSeen(notificationId);
  }
  const NofificationRing = useCallback(
    () => (
      <Dropdown
        className="ml-auto lg:ml-0"
        menu={notificationList.list}
        left={lang === "en"}
        right={lang === "ar"}
        listRender={(menu) =>
          menu.slice(0, 10).map((item, idx) => (
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
    ),
    [notificationList]
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
    <nav className="top-nav z-20">
      <BurgerMenuIcon className="burger-menu-icon" onClick={toggleSideMenu} />
      <NavbarLogo
        className="app-logo"
        onClick={() => {
          navigate("/");
        }}
      />
      <ul className="nav-menu">
        {navItems.map((item, idx) => {
          const content = (
            <Dropdown
              withHover
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
          );

          return item.render ? (
            <li key={idx} className="nav-item">
              {item.render(content)}
            </li>
          ) : (
            <li key={idx} className="nav-item">
              {content}
            </li>
          );
        })}
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
