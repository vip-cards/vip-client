import classNames from "classnames";
import { useTranslation } from "react-i18next";
import "./MainButton.scss";

const MainButton = ({
  text = "",
  children,
  className,
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
        "main-button hover:-translate-y-[2px] hover:disabled:translate-y-0 shadow transition-all capitalize hover:shadow-lg hover:disabled:shadow-none active:-translate-y-[0.5px] active:shadow will-change-transform duration-100",
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
