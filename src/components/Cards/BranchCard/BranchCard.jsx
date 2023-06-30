import { ReactComponent as Rate } from "assets/VIP-ICON-SVG/rate.svg";
import { getLocalizedWord } from "helpers/lang";
import { useParams } from "react-router";
import "./BranchCard.scss";
import { ROUTES } from "constants";
import { Link } from "react-router-dom";

export default function BranchCard({ branch }) {
  const { vendorId } = useParams();
  return (
    <Link
      className="branch-card block"
      to={`/${ROUTES.VENDORS}/${vendorId}/${branch._id}`}
    >
      <div className="branch-info-container">
        <div className="branch-img-container">
          <img
            src={`${branch?.image?.Location}`}
            alt="branch-img"
            className="branch-img"
          />
        </div>
        <div className="branch-title capitalize">
          <p>{getLocalizedWord(branch.name)} </p>
        </div>
      </div>
    </Link>
  );
}
