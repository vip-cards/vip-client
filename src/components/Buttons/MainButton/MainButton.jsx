import classNames from "classnames";
import "./MainButton.scss";

const MainButton = ({
  text = "",
  children,
  className,
  size = "medium",
  variant = "primary",
  loading = false,
  ...props
}) => {
  return (
    <button
      className={classNames(className, "main-button", variant, size)}
      {...props}
    >
      {loading ? <i className="fas fa-spinner fa-spin"></i> : text || children}
    </button>
  );
};
export default MainButton;
