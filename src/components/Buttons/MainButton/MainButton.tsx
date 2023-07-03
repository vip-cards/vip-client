import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import "./MainButton.scss";

interface IMainButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
  variant?:
    | "primary"
    | "secondary"
    | "primary-outline"
    | "secondary-outline"
    | "primary-light"
    | "secondary-light"
    | "primary-light-outline"
    | "secondary-light-outline"
    | "danger"
    | "danger-light"
    | "danger-light-outline"
    | "danger-outline"
    | "success"
    | "success-light"
    | "success-light-outline"
    | "success-outline"
    | "warning"
    | "warning-light"
    | "warning-light-outline"
    | "warning-outline"
    | "info"
    | "info-light"
    | "info-light-outline"
    | "info-outline";
  loading?: boolean;
  active?: boolean;
}

const MainButton: React.FC<IMainButton> = ({
  text = "",
  children = () => <></>,
  className = "",
  size = "medium",
  variant = "primary",
  loading = false,
  active = true,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <button
      disabled={loading}
      className={classNames(
        "main-button hover:-translate-y-[2px] hover:disabled:translate-y-0 shadow transition-all capitalize hover:shadow-lg hover:disabled:shadow-none active:-translate-y-[0.5px] active:shadow will-change-transform",
        "!duration-150 before:translate-x-0 after:translate-x-0 before:translate-y-0 after:translate-y-0",
        "ease-in-out",
        {
          "opacity-50 !bg-secondary": !active,
          "opacity-50 pointer-events-none": loading,
        },
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
        className,
        variant,
        size
      )}
      {...props}
    >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} spin />
      ) : (
        t(text) || (children as any)
      )}
    </button>
  );
};

export default MainButton;
