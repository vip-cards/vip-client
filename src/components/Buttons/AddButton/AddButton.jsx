import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "./AddButton.scss";

function AddButton({ link, title }) {
  const navigate = useNavigate();
  return (
    <div className="add-button-container">
      <button className="add-button" onClick={() => navigate(link)}>
        <span>{title}</span>
        <span>
          <FontAwesomeIcon icon={faCirclePlus} />
        </span>
      </button>
    </div>
  );
}
export default AddButton;
