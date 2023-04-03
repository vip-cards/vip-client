import React from "react";
import { useNavigate } from "react-router";
import { ReactComponent as Rate } from "../../assets/VIP-ICON-SVG/rate.svg";
import i18n from "../../locales/i18n";
import "./BranchCard.scss";

export default function BranchCard({ branch }) {
  const navigate = useNavigate();
  const lang = i18n.language;

  return (
    <div className="branch-card">
      <div
        className="branch-card-container"
        onClick={() => {
          navigate(`${branch._id}`);
        }}
      >
        <div className="branch-img-container">
          <img
            className="branch-img"
            src={`${branch?.image?.Location}`}
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
