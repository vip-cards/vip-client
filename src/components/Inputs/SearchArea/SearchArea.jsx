import React from "react";
import SearchInput from "../SearchInput/SearchInput";
import "./SearchArea.scss";

export default function SearchArea({ ...props }) {
  return (
    <div className="search-area">
      <div className="search-input-container">
        <SearchInput {...props} />
      </div>
    </div>
  );
}
