import { faClose } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { IconButton } from "../Buttons";

import classes from "./Modal.module.scss";

interface IModal {
  visible?: boolean;
  onClose: (x: any) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  footer?: () => React.ReactNode;
}

const Modal: React.FC<IModal> = ({
  visible = false,
  onClose,
  title,
  children,
  className,
  footer,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [visible]);

  const content = (
    <div className={classes.backdrop} onClick={onClose}>
      <motion.div
        initial={{ scale: 0.1, opacity: 0, x: "-50%", y: "-50%" }}
        animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
        exit={{ scale: 0.1, opacity: 0, x: "-50%", y: "-50%" }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
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
          <div
            className={classNames(
              classes.body,
              className,
              "max-w-full overflow-auto"
            )}
          >
            {children}
          </div>
          <div className={classes.footer}>{footer && footer()}</div>
        </div>
      </motion.div>
    </div>
  );

  useEffect(() => {
    if (visible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [visible]);
  if (visible) return createPortal(content, document.getElementById("root"));
  return null;
};

export default Modal;
