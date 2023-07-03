import { ReactComponent as VendorLogoOrange } from "assets/VIP-ICON-SVG/VendorLogoOrange.svg";
import Modal from "components/Modal/Modal";
import { getLocalizedWord } from "helpers/lang";
import { useTranslation } from "react-i18next";

function AdminSelectModal({
  isModalVisible,
  setIsModalVisible,
  adminsList,
  handleCreateAdminRoom,
}) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={isModalVisible}
      onClose={() => setIsModalVisible(false)}
      title={t("availableToChat")}
      className="max-h-48 overflow-auto p-3"
    >
      <div className="chat-modal">
        {/* Admin */}
        {!!adminsList.length &&
          adminsList?.map((admin: IChatter) => (
            <button
              onClick={() => handleCreateAdminRoom(admin?._id)}
              key={admin._id + "-item"}
              className="flex-row w-full flex-nowrap flex items-center gap-3 hover:ring border-2 px-3 py-1 rounded-xl"
            >
              <span className="w-12 flex  items-center border bg-slate-200/50 justify-center aspect-square rounded-3xl overflow-hidden">
                <VendorLogoOrange className="text-slate-800 p-1.5" />
              </span>
              <span className="flex-grow text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                {getLocalizedWord(admin?.name)}
              </span>
            </button>
          ))}
      </div>
    </Modal>
  );
}

export default AdminSelectModal;
