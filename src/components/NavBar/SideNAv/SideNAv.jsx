import { t } from "i18next";
import React from "react";
import { NavLink } from "react-router-dom";
import { switchLang } from "../../../helpers/lang";
import i18n from "../../../locales/i18n";

import "./SideNAv.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
export default function SideNAv({ items, onToggle }) {
  const lang = i18n.language;

  function changeLang(lang) {
    i18n.changeLanguage(lang);
    switchLang(lang);
  }
  function onSideNavClose() {
    onToggle();
  }
  return (
    <aside className="side-nav-container" /*onClick={onSideNavClose}*/>
      <div className="side-nav">
        <ul className="side-nav-menu">
          <div className="nav-icon-container">
            <FontAwesomeIcon
              icon={faXmark}
              className="nav-close-icon"
              onClick={onSideNavClose}
            />
          </div>
          {items.map((item, idx) => (
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
    </aside>
  );
}
