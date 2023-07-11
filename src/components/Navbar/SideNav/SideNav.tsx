import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ROUTES } from "constants/routes";
import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "store/actions";
import { switchLang } from "../../../helpers/lang";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./SideNav.scss";

export default function SideNav({ items, onToggle, setConfirmModal }) {
  const { t, i18n } = useTranslation();
  const sideNavRef = useRef<HTMLDivElement>();

  const lang = i18n.language;

  function onSideNavClose() {
    onToggle();
  }

  function logoutHandler(e) {
    e.preventDefault();
    setConfirmModal(true);
  }

  function backDropClickHandler(e: React.MouseEvent<HTMLElement>) {
    if (sideNavRef.current && !sideNavRef?.current?.contains(e.target)) {
      onToggle();
    } else if (e.target.classList.contains("nav-link")) {
      sideNavRef?.current?.classList.add("close");
      setTimeout(() => {
        onToggle();
      }, 300);
    }
  }

  return (
    <aside
      className="side-nav-container bg-black/25"
      onClick={backDropClickHandler}
    >
      <div className="side-nav [&_*]:capitalize" ref={sideNavRef}>
        <ul className="side-nav-menu">
          <div className="nav-icon-container !my-1">
            <FontAwesomeIcon
              icon={faXmark}
              className="nav-close-icon"
              onClick={onSideNavClose}
            />
          </div>
          {items.map(
            (item, idx: number) =>
              !!item?.menu?.length || (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: -10, x: lang === "en" ? -20 : 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: -10, x: lang === "en" ? -20 : 20 }}
                  transition={{ delay: idx * 0.035 }}
                  className="nav-item"
                >
                  <NavLink
                    to={item.link}
                    className={(navData) =>
                      navData.isActive
                        ? "active nav-link block"
                        : "nav-link block"
                    }
                    onClick={item.onClick}
                  >
                    {t(item.title)}
                  </NavLink>
                </motion.li>
              )
          )}
          <li className="nav-item border-t border-t-white/25">
            <NavLink
              to={`/${ROUTES.ACCOUNT}`}
              className={(navData) =>
                navData.isActive ? "active nav-link block" : "nav-link block"
              }
            >
              {t("myAccount")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to={`/${ROUTES.SUBSCRIBE}`}
              className={(navData) =>
                navData.isActive ? "active nav-link block" : "nav-link block"
              }
            >
              {t("VIP premium")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to={`/${ROUTES.LOGOUT}`}
              className={(navData) =>
                navData.isActive ? "active nav-link block" : "nav-link block"
              }
              onClick={(e) => logoutHandler(e)}
            >
              {t("logout")}
            </NavLink>
          </li>
          <li
            className="nav-item"
            onClick={() => switchLang(lang === "en" ? "ar" : "en")}
          >
            <div className={"nav-link"}> {t("lang")}</div>
          </li>
        </ul>
      </div>
    </aside>
  );
}
