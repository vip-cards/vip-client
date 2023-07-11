import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useState } from "react";
import "./PointsCard.scss";

export default function PointsCard({ vendor: vendorData }) {
  console.log("-----------vendorData-----------", vendorData);
  return (
    <div className="flex flex-col">
      <article className="order-card relative">
        <div className="order-image-container">
          <img
            className="order-image bg-primary/60 min-h-full object-cover"
            src={vendorData?.vendor?.image?.Location}
            alt={getLocalizedWord(vendorData?.vendor?.name)}
            loading="lazy"
          />
        </div>
        <div className="order-vendor-name">
          <span>
            {getLocalizedWord(vendorData?.vendor?.name) || "Vendor name"}
          </span>
        </div>

        <div className="order-points">
          <span className="number">{vendorData?.availablePoints}</span> &nbsp;
          <span className="text">availablePoints</span>
        </div>

        <div className="order-money">
          <span className="number">{vendorData?.usedPoints}</span> &nbsp;
          <span className="text">usedPoints</span>
        </div>
      </article>
    </div>
  );
}
