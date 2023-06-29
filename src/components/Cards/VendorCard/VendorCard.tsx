import vendorPlaceHolder from "assets/images/vendorPlaceHolder.png";
import { getLocalizedWord } from "helpers/lang";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import "./VendorCard.scss";

export default function VendorCard({ vendor }) {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 14,
      }}
      type="button"
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
        <p className="vendor-title text-start">{getLocalizedWord(vendor.name)} </p>
        <div className="vendor-description leading-6 !mt-1 !text-xs">
          <p className="price">{getLocalizedWord(vendor.description)}</p>
        </div>
      </div>
    </motion.button>
  );
}
