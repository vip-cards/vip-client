import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as RegularHeart } from "@fortawesome/free-regular-svg-icons";

import "./WishIcon.scss";

export default function WishIcon({ wished, ...props }) {
  const Icon = () =>
    wished ? (
      <FontAwesomeIcon icon={SolidHeart} />
    ) : (
      <FontAwesomeIcon icon={RegularHeart} />
    );

  return (
    <button
      className="wish-icon"
      {...props}
    
    >
      <Icon />
    </button>
  );
}
