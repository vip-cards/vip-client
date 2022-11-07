import React from "react";
import "./VendorCard.scss";
import i18n from "../../locales/i18n";
import { useNavigate } from "react-router";
import imagesPath from "../../services/imagesPath";
import vendorPlaceHolder from "../../assets/images/vendorPlaceHolder.png";

export default function VendorCard({ vendor }) {
  const lang = i18n.language;
  const navigate = useNavigate();

  return (
    <div
      className="vendor-card"
      onClick={() => {
        navigate(`/vendors/${vendor._id}`);
      }}
    >
      <div className="vendor-img-container">
        {/* <img
          src={`${imagesPath}${vendor?.image?.path}`}
          alt="vendor-img"
          className="vendor-img"
        /> */}
        <img src={vendorPlaceHolder} alt="vendor-img" className="vendor-img" />
      </div>
      <div className="vendor-info-container">
        <p className="vendor-title">{vendor.name[lang]} </p>
        <div className="vendor-description">
          <p className="price">{vendor.description[lang]}</p>
        </div>
      </div>
    </div>
  );
}
