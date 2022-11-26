import { t } from "i18next";
import React from "react";
import { useNavigate } from "react-router";
import branchImage from "../../assets/images/productImg.png";
import { ReactComponent as Rate } from "../../assets/VIP-ICON-SVG/rate.svg";
import i18n from "../../locales/i18n";
import endPoint from "../../services/endPoint";
import branchPlaceHolder from "../../assets/images/branchPlaceHolder.png";
import "./BranchCard.scss";
import imagesPath from "../../services/imagesPath";

export default function BranchCard({ branch }) {
  const navigate = useNavigate();
  const lang = i18n.language;

  console.log(branch);
  return (
    <div className="branch-card">
      <div
        className="branch-card-container"
        onClick={() => {
          navigate(`${branch._id}/offers`);
        }}
      >
        <div className="branch-img-container">
          <img
            className="branch-img"
            src={`${imagesPath}${branch?.image?.path}`}
            alt="branch-img"
          />
        </div>
        <div className="branch-info-actions">
          <div className="brcanch-info">
            <p className="branch-name">{branch.name[lang]}</p>
            {/* <p className="manager-name">Manager Name</p> */}
            <p className="rate">
              <Rate className="rate-icon" /> 4
            </p>
            <p className="orders">652 orders</p>
            <button className="open">Open</button>
          </div>
        </div>
      </div>
    </div>
  );
}
