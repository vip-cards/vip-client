import React from "react";
import "./SearchArea.scss";
import SearchInput from "../SearchInput/SearchInput";

export default function SearchArea({ ...props }) {
  return (
    <div className="search-area">
      <div className="search-input-container">
        <SearchInput {...props} />
      </div>
    </div>
  );
}
