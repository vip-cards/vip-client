import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import Modal from "components/Modal/Modal";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import clientServices from "services/clientServices";

function EditPassworModal({ showPasswordModal, handleClosePasswordModal, id }) {
  const { t } = useTranslation();

  const [fields, setFields] = useState({
    newPassword: "",
  });

  async function updatePasswordHandler(evt) {
    evt.preventDefault();
    clientServices
      .changePassword(id, fields.newPassword)
      .then((res) => {
        toastPopup.success(t("passwordUpdated") + "!");
      })
      .catch(responseErrorToast)
      .finally(() => {
        handleClosePasswordModal();
      });
  }

  return (
    <Modal
      visible={showPasswordModal}
      onClose={handleClosePasswordModal}
      title={t("Change Password")}
    >
      <form
        className="flex flex-col gap-y-6 py-6"
        autoComplete="off"
        onSubmit={updatePasswordHandler}
      >
        <MainInput
          type="password"
          name="newPassword"
          autoComplete="new password"
          state={fields}
          setState={setFields}
        />
        <MainButton className="mx-auto">{t("Change Password")}</MainButton>
      </form>
    </Modal>
  );
}
export default EditPassworModal;
