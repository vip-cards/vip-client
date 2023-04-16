import { ReactComponent as Rate } from "assets/VIP-ICON-SVG/rate.svg";
import { getLocalizedWord } from "helpers/lang";
import { useNavigate, useParams } from "react-router";
import "./BranchCard.scss";
import { ROUTES } from "constants";

export default function BranchCard({ branch }) {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  return (
    <div className="branch-card">
      <div
        className="branch-card-container"
        onClick={() => {
          navigate(`/${ROUTES.VENDORS}/${vendorId}/${branch._id}`);
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
            <p className="branch-name">{getLocalizedWord(branch.name)}</p>
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
