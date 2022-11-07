import { t } from "i18next";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { switchLang } from "../../../helpers/lang";
import i18n from "../../../locales/i18n";
import { authActions } from "../../../store/auth-slice";
import "./SideNAv.scss";
export default function SideNAv() {
  const dispatch = useDispatch();
  const lang = i18n.language;
  let auth = useSelector((state) => state.auth);

  function logoutHandler() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    dispatch(authActions.logout());
  }

  function changeLang(lang) {
    i18n.changeLanguage(lang);
    switchLang(lang);
  }
  return (
    <div className="side-nav">
      <ul className="side-nav-menu">
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
            to="/settings"
            className={(navData) =>
              navData.isActive ? "active nav-link" : "nav-link"
            }
          >
            {t("settings")}
          </NavLink>
        </li>

        <li className="nav-item" onClick={logoutHandler}>
          <div className={"nav-link"}>{t("logout")}</div>
        </li>

        <li
          className="nav-item"
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
          <div className={"nav-link"}> {t("lang")}</div>
        </li>
      </ul>
    </div>
  );
}
