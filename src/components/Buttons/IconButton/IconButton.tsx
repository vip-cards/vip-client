import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import cls from "classnames";
import classes from "./IconButton.module.scss";

interface IIconButton {
  className?: string;
  variant?: "primary" | "secondary";
  icon: FontAwesomeIconProps["icon"];
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  [x: string]: Omit<FontAwesomeIconProps, "icon"> | any;
}

const IconButton: React.FC<IIconButton> = ({
  className,
  variant,
  icon,
  ...rest
}) => {
  return (
    <span
      className={cls(classes.btn, className, {
        [classes.primary]: !!(variant === "primary"),
        // "text-secondary": !!(variant === "secondary"),
      })}
    >
      <FontAwesomeIcon
        icon={icon}
        {...(rest as unknown as Omit<FontAwesomeIconProps, "icon">)}
      />
    </span>
  );
};

export default IconButton;
