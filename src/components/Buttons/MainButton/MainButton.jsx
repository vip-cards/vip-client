import classNames from "classnames";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import "./MainButton.scss";

const MainButton = ({
  text = "",
  children = () => <></>,
  className = "",
  size = "medium",
  variant = "primary",
  loading = false,
  active,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <button
      className={classNames(
        {
          "px-2 py-0.5 text-sm rounded-md": size === "small",
          "px-3 py-1 text-base rounded-lg": size === "medium",
          "px-4 py-2 text-lg rounded-xl": size === "large",
        },
        {
          "bg-primary text-white": variant === "primary",
          "bg-secondary text-white": variant === "secondary",
          "bg-transparent text-primary border-primary border":
            variant === "primary-outline",
          "bg-transparent text-secondary border-secondary border":
            variant === "secondary-outline",
          "bg-primary/10 text-primary": variant === "primary-light",
          "bg-secondary/10 text-secondary": variant === "secondary-light",
          "bg-transparent text-primary border-primary/10 border":
            variant === "primary-light-outline",
          "bg-transparent text-secondary border-secondary/10 border":
            variant === "secondary-light-outline",
          "bg-danger text-white": variant === "danger",
          "bg-danger/10 text-danger": variant === "danger-light",
          "bg-danger/10 text-danger border-danger/10 border":
            variant === "danger-light-outline",
          "bg-danger/10 text-danger border-danger border":
            variant === "danger-outline",
          "bg-success text-white": variant === "success",
          "bg-success/10 text-success": variant === "success-light",
          "bg-success/10 text-success border-success/10 border":
            variant === "success-light-outline",
          "bg-success/10 text-success border-success border":
            variant === "success-outline",
          "bg-warning text-white": variant === "warning",
          "bg-warning/10 text-warning": variant === "warning-light",
          "bg-warning/10 text-warning border-warning/10 border":
            variant === "warning-light-outline",
          "bg-warning/10 text-warning border-warning border":
            variant === "warning-outline",
          "bg-info text-white": variant === "info",
          "bg-info/10 text-info": variant === "info-light",
          "bg-info/10 text-info border-info/10 border":
            variant === "info-light-outline",
          "bg-info/10 text-info border-info border": variant === "info-outline",
        },

        "main-button hover:-translate-y-[2px] hover:disabled:translate-y-0 shadow transition-all capitalize hover:shadow-lg hover:disabled:shadow-none active:-translate-y-[0.5px] active:shadow will-change-transform",
        "duration-200 ease-in-out",
        className,
        variant,
        size
      )}
      {...props}
    >
      {loading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        t(text) || children
      )}
    </button>
  );
};

export default MainButton;
// generate proptypes for this component
MainButton.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "primary-outline",
    "secondary-outline",
    "primary-light",
    "secondary-light",
    "primary-light-outline",
    "secondary-light-outline",
    "danger",
    "danger-light",
    "danger-light-outline",
    "danger-outline",
    "success",
    "success-light",
    "success-light-outline",
    "success-outline",
    "warning",
    "warning-light",
    "warning-light-outline",
    "warning-outline",
    "info",
    "info-light",
    "info-light-outline",
    "info-outline",
  ]),
  loading: PropTypes.bool,
  active: PropTypes.bool,
};

// generate default props for this component
MainButton.defaultProps = {
  text: "",
  children: null,
  className: "",
  size: "medium",
  variant: "primary",
  loading: false,
  active: false,
};
