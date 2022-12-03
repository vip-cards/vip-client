import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";

import "./RatingStars.scss";

export default function RatingStars({ rate: vendorRate = 0 }) {
  const rate = Math.ceil(vendorRate);

  return (
    <div className="stars-container">
      {[...Array(5)].slice(0, rate).map((_, idx) => (
        <FontAwesomeIcon key={idx} icon={fasStar} />
      ))}
      {[...Array(5)].slice(rate).map((_, idx) => (
        <FontAwesomeIcon key={idx + rate} icon={faStar} />
      ))}
    </div>
  );
}
