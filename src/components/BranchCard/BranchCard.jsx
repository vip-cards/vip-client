import React from "react";
import { useNavigate } from "react-router";
import branchImage from "../../assets/images/productImg.png";
import { ReactComponent as Rate } from "../../assets/VIP-ICON-SVG/rate.svg";
import "./BranchCard.scss";

export default function BranchCard({ branch }) {
  const navigate = useNavigate();
  return (
    <div className="branch-card">
      <div className="branch-img-container">
        <img className="branch-img" src={branchImage} alt="branch-img" />
      </div>
      <div className="branch-info-actions">
        <div className="brcanch-info">
          <p className="branch-name">Branch Name</p>
          <p className="manager-name">Manager Name</p>
          <p className="rate">
            <Rate className="rate-icon" /> 4
          </p>
          <p className="orders">652 orders</p>
          <button
            className="open"
            onClick={() => {
              navigate(`/branches/${branch._id}/offers`);
            }}
          >
            Open
          </button>
        </div>
        <div className="branch-actions">
          <button className="remove">Remove</button>
          <button className="edit">Edit</button>
        </div>
      </div>
    </div>
  );
}
