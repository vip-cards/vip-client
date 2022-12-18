import { t } from "i18next";
import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { switchLang } from "../../../helpers/lang";
import i18n from "../../../locales/i18n";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./SideNav.scss";

export default function SideNav({ items, onToggle }) {
  const lang = i18n.language;
  const sideNavRef = useRef();

  function changeLang(lang) {
    i18n.changeLanguage(lang);
    switchLang(lang);
  }
  function onSideNavClose() {
    onToggle();
  }

  function backDropClickHandler(e) {
    console.log(e.target.classList.contains("nav-link"));
    if (sideNavRef.current && !sideNavRef.current.contains(e.target)) {
      onToggle();
    } else if (e.target.classList.contains("nav-link")) {
      sideNavRef.current.classList.add("close");
      setTimeout(() => {
        onToggle();
      }, 300);
    }
  }
  return (
    <aside className="side-nav-container" onClick={backDropClickHandler}>
      <div className="side-nav" ref={sideNavRef}>
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
