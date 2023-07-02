import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

interface IChatTextInput {
  activeRoom?: IRoom;
  messageText: string;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

export function ChatTextInput({
  activeRoom,
  messageText,
  setMessageText,
  handleSendMessage,
}: IChatTextInput) {
  const { t } = useTranslation();

  return (
    <div className="mt-auto w-full border-t-2">
      <div
        className={classNames(
          { "pointer-events-none opacity-50": !activeRoom?._id },
          "flex flex-row justify-center items-center w-full gap-5 p-4"
        )}
      >
        <textarea
          className={classNames(
            "w-full ring-1 h-[2.5rem] leading-[2.4rem] rounded-lg ring-primary whitespace-pre-line resize-none py-2 px-4",
            { "opacity-60 pointer-events-none": activeRoom?.isBlocked }
          )}
          placeholder={
            activeRoom?._id
              ? activeRoom?.isBlocked
                ? t("youCannotSendMessagesToThisChat")
                : t("typeMessage")
              : t("selectRoom")
          }
          value={messageText}
          onChange={(e) => {
            if (activeRoom?.isBlocked) return;
            setMessageText(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.code === "Enter" && !e.shiftKey) {
              handleSendMessage();
            }
          }}
        />
        <FontAwesomeIcon
          size="xl"
          icon={faPaperPlane}
          className="text-primary cursor-pointer hover:text-amber-600 active:scale-90"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
}
