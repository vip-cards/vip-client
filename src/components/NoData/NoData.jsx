import { t } from "i18next";
import React from "react";
// import { ReactComponent as NoDataAvatar } from "../../assets/VIP-ICON-SVG/nodata.svg";
import { ReactComponent as NoDataAvatar } from "../../assets/VIP-ICON-SVG/nodata.svg";
import "./NoData.scss";

export default function NoData({ text = t("No Data") }) {
  return (
    <div className="no-data">
      <NoDataAvatar className="no-data-svg" />
      <h2 className="no-data-text">{text}</h2>
    </div>
  );
}
