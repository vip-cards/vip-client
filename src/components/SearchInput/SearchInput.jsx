import React from "react";
import "./SearchInput.scss";
import { ReactComponent as SearchIcon } from "../../assets/VIP-ICON-SVG/SearchIcon.svg";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";

export default function SearchInput({ onChange, loading, ...props }) {
  return (
    <div className="form-search">
      <input
        className="input-search"
        type="text"
        name="search"
        id="search"
        placeholder={t("Search")}
        onChange={onChange}
        {...props}
      />
      <label className="label-search">
        <div className={`search-icon-container ${loading ? "searching" : ""}`}>
          <FontAwesomeIcon icon={faStore} className="search-icon-bg" />
          <SearchIcon className="search-icon-mag" />
        </div>
      </label>
    </div>
  );
}
