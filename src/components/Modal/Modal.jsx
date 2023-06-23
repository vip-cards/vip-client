import { faClose } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { IconButton } from "../Buttons";
import classes from "./Modal.module.scss";

const Modal = ({
  visible = false,
  onClose,
  title,
  children,
  className,
  footer,
}) => {
  const { t } = useTranslation();
  const content = (
    <div className={classes.backdrop} onClick={onClose}>
      <div
        className={classes["modal-container"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.modal}>
          <div className={classes.header}>
            <span className={classes.title}>{t(title)}</span>

            <div className={classNames(classes.close, "rtl:mr-auto rtl:!ml-0")}>
              <IconButton icon={faClose} onClick={onClose} size="lg" />
            </div>
          </div>
          <div className={classNames(classes.body, className, "max-w-full")}>
            {children}
          </div>
          <div className={classes.footer}>{footer && footer()}</div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (visible) {
      const toToDistance = document.documentElement.scrollTop;
      // When the modal is shown, we want a fixed body
      document.body.classList.add("modal-open");
      document.body.style.top = `-${toToDistance}px`;
    } else {
      // When the modal is hidden...
      const scrollY = document.body.style.top;
      document.body.classList.remove("modal-open");
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [visible]);

  if (visible) return createPortal(content, document.getElementById("root"));
  return null;
};

Modal.defaultProps = {
  visible: PropTypes.bool,
};

export default Modal;
