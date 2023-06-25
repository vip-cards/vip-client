import vendorPlaceHolder from "assets/images/vendorPlaceHolder.png";
import { getLocalizedWord } from "helpers/lang";
import { useNavigate } from "react-router";
import "./VendorCard.scss";

export default function VendorCard({ vendor }) {
  const navigate = useNavigate();

  return (
    <div
      className="vendor-card"
      onClick={() => {
        navigate(`/vendors/${vendor._id}`);
      }}
    >
      <div className="vendor-img-container max-w-[102%]">
        <img
          src={`${vendor?.image?.Location ?? vendorPlaceHolder}`}
          alt="vendor-img"
          className="vendor-img"
        />
        {/* <img src={vendorPlaceHolder} alt="vendor-img" className="vendor-img" /> */}
      </div>
      <div className="vendor-info-container">
        <p className="vendor-title">{getLocalizedWord(vendor.name)} </p>
        <div className="vendor-description leading-6 !mt-1 !text-xs">
          <p className="price">{getLocalizedWord(vendor.description)}</p>
        </div>
      </div>
    </div>
  );
}
