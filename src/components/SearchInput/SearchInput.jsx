import React from "react";
import "./SearchInput.scss";
import { ReactComponent as SearchIcon } from "../../assets/VIP-ICON-SVG/SearchIcon.svg";
import { t } from "i18next";

export default function SearchInput({ onChange }) {
  return (
    <div className="form-search">
      <input
        className="input-search"
        type="text"
        name="search"
        id="search"
        placeholder={t("Search")}
        onChange={onChange}
      />
      <label className="label-search">
        <SearchIcon className="SearchLogo" />
      </label>
    </div>
  );
}
