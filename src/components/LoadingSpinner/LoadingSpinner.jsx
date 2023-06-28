import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner-continer">
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
  );
}
