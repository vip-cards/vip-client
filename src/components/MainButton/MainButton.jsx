import "./MainButton.scss";

import React from "react";

export default function MainButton({
  text = "",
  onClick = () => {},
  loading = false,
}) {
  return (
    <button className="main-button">
      {loading ? <i className="fas fa-spinner fa-spin "></i> : text}
    </button>
  );
}
