import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cls from "classnames";
import classes from "./IconButton.module.scss";
const IconButton = ({ className, variant, icon, ...rest }) => {
  return (
    <span
      className={cls(classes.btn, className, {
        [classes.primary]: !!(variant === "primary"),
      })}
    >
      <FontAwesomeIcon icon={icon} {...rest} />
    </span>
  );
};

export default IconButton;
