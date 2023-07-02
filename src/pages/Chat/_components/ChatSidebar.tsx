import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainButton } from "components/Buttons";
import { useTranslation } from "react-i18next";

interface IChatSidebar {
  children: React.ReactNode;
  onCreateModal: React.MouseEventHandler<HTMLButtonElement>;
}

export function ChatSidebar({ children, onCreateModal }: IChatSidebar) {
  const { t } = useTranslation();

  return (
    <div className="chat-sidebar !pt-16 max-sm:!w-32 w-[25vw] max-w-[240px] flex-shrink-0 max-sm:!px-0 rtl:!pr-3 rtl:!pl-0">
      {children}
      <MainButton
        variant="primary"
        size="large"
        className="whitespace-nowrap !text-primary !bg-white mt-auto w-fit mx-auto flex flex-row justify-center items-center gap-2 text-sm max-md:!text-xs font-semibold"
        onClick={onCreateModal}
      >
        <FontAwesomeIcon
          icon={faPlusCircle}
          className="max-sm:p-3 max-sm:!text-xl"
        />
        <span className="max-sm:hidden capitalize ">{t("createRoom")}</span>
      </MainButton>
    </div>
  );
}
