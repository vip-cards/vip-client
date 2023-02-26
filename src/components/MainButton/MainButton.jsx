import classNames from "classnames";
import "../../index.scss";
import "./MainButton.scss";

export default function MainButton({
  text = "",
  loading = false,
  className,
  ...props
}) {
  return (
    <button className={classNames(className, "main-button")} {...props}>
      {loading ? <i className="fas fa-spinner fa-spin "></i> : text}
    </button>
  );
}
