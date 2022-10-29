import React from "react";
import "./SearchInput.scss";
import { ReactComponent as SearchIcon } from "../../assets/VIP-ICON-SVG/SearchIcon.svg";
import { t } from "i18next";
export default function SearchInput() {
  return (
    <div className="form-search">
      <input
        className="input-search"
        type="text"
        name="search"
        id="search"
        placeholder={t("What Are You Looking For?")}
      />
      <label className="label-search">
        <SearchIcon className="SearchLogo" />
      </label>
    </div>
  );
}
