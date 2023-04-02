import React from "react";
import { useNavigate } from "react-router";
import i18n from "../../locales/i18n";
import "./BannerCard.scss";

export default function BannerCard({ banner }) {
  const lang = i18n.language;
  const navigate = useNavigate();

  return (
    <div
      className="category-card"
      onClick={() => {
        // navigate(`/categories/${category._id}`);
      }}
    >
      <div className="category-info-container">
        <div className="category-img-container">
          <img
            src={`${banner?.image?.Location}`}
            alt="category-img"
            className="category-img"
          />
        </div>
        {/* <div className="category-title">
          <p>{t("Ads")}</p>
        </div> */}
      </div>
    </div>
  );
}
