import React from "react";
import "./SearchArea.scss";
import { ReactComponent as SearchIcon } from "../../assets/VIP-ICON-SVG/SearchIcon.svg";
import { t } from "i18next";
import SearchInput from "../SearchInput/SearchInput";
export default function SearchArea() {
  return (
    <div className="search-area">
      <div className="search-input-container">
        <SearchInput />
      </div>
    </div>
  );
}
