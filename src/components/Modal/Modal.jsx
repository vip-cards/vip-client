import { faClose } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import classes from "./Modal.module.scss";
import PropTypes from "prop-types";
import classNames from "classnames";
import { IconButton } from "../Buttons";
import { useRef } from "react";

const Modal = ({
  visible = false,
  onClose,
  title,
  children,
  className,
  footer,
}) => {
  const content = (
    <div className={classes.backdrop} onClick={onClose}>
      <div
        className={classes["modal-container"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.modal}>
          <div className={classes.header}>
            <span className={classes.title}>{title}</span>

            <div className={classes.close}>
              <IconButton icon={faClose} onClick={onClose} size="lg" />
            </div>
          </div>
          <div className={classNames(classes.body, className)}>{children}</div>
          <div className={classes.footer}>{footer && footer()}</div>
        </div>
      </div>
    </div>
  );

  if (visible) return createPortal(content, document.getElementById("root"));
  return null;
};

Modal.defaultProps = {
  visible: PropTypes.bool,
};

export default Modal;
