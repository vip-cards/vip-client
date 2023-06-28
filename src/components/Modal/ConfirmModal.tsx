import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainButton } from "components/Buttons";
import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";

interface IConfirmModal {
  visible?: boolean;
  title: string;
  message: string;
  onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ConfirmModal: React.FC<IConfirmModal> = ({
  visible = false,
  title,
  message,
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  const { t } = useTranslation();
  const handleCancel = (e) => {
    e.stopPropagation();

    onCancel(e);
  };
  const handConfirm = (e) => {
    e.stopPropagation();
    onConfirm(e);
  };

  return (
    <Modal
      visible={visible}
      title={title}
      onClose={onCancel}
      className="confirm-modal"
    >
      <div className="flex justify-center items-center flex-col gap-4">
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className="text-danger/50 animate-pulse duration-1000"
          size="4x"
        />
        <h6 className="text-base text-center">{t("AreYouSure")}</h6>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-center py-3 text-gray-800">{message}</p>
        <div className="flex gap-4 w-full justify-between">
          <MainButton variant="success" size="large" onClick={handConfirm}>
            {t("confirm")}
          </MainButton>
          <MainButton variant="danger" size="large" onClick={handleCancel}>
            {t("cancel")}
          </MainButton>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
