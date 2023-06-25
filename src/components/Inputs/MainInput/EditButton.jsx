import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

const EditButton = ({ toEdit, disableState, toggleDisabledHandler }) =>
  !!toEdit && (
    <button
      type="button"
      className={classNames("edit-field-icon", {
        active: !disableState,
      })}
      onClick={toggleDisabledHandler}
    >
      <FontAwesomeIcon icon={faPenToSquare} />
    </button>
  );
export default EditButton;
