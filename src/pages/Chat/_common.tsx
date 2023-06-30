import {
  faPaperPlane,
  faPlusCircle,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface IMessage {
  text: string;
  timestamp: string;
  [key: string]: any;
}

export const ChatContainer = ({ children }) => (
  <div className="chat-page-container app-card-shadow max-w-[80vw] max-sm:max-w-full max-h-[80vh] max-sm:max-h-full min-w-[300px] mx-auto my-8">
    {children}
  </div>
);

interface IChatSidebar {
  children: React.ReactNode;
  onCreateModal: React.MouseEventHandler<HTMLButtonElement>;
}
export function ChatSidebar({ children, onCreateModal }: IChatSidebar) {
  const { t } = useTranslation();
  return (
    <div className="chat-sidebar max-sm:!w-32 rtl:!pr-3 rtl:!pl-0">
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

interface IChatBodyContainer {
  children: React.ReactNode;
  messageList: IMessage[];
  activeRoom: string | null;
  onCreateModal: () => void;
}

export function ChatBodyContainer({
  children,
  messageList,
  activeRoom,
}: IChatBodyContainer) {
  return (
    <div
      className={classNames("w-full h-full flex flex-col", {
        "bg-slate-200 duration-1000 animate-pulse":
          !messageList?.length && activeRoom,
      })}
    >
      {children}
    </div>
  );
}

interface IMessageListRender {
  messageList: IMessage[];
  userRole: string;
  userId: string;
}

export function MessageListRender({
  messageList,
  userRole,
  userId,
}: IMessageListRender) {
  if (!messageList.length) return null;
  return messageList?.map((message) => (
    <div
      key={message.timestamp ?? new Date().toISOString() + Math.random() * 10}
      className={classNames("py-3 px-5 rounded", {
        "bg-slate-600 ml-auto w-fit rounded-l-3xl rounded-tr-3xl text-slate-100":
          message[userRole] === userId || message[userRole]?._id === userId,
        "bg-slate-300 mr-auto w-fit rounded-r-3xl rounded-bl-3xl text-slate-900":
          !(message[userRole] === userId || message[userRole]?._id === userId),
      })}
    >
      <div className="flex flex-col">
        <span>{message.text}</span>
        <span className="text-xs self-end text-slate-400 leading-3">
          {message.timestamp
            ? dayjs(message.timestamp).format("DD-MM-YYYY hh:mm a")
            : null}
        </span>
      </div>
    </div>
  ));
}

interface IChatMessageListContainer {
  chatRef: React.RefObject<HTMLDivElement>;
  messageList: IMessage[];
  userId: string;
  userRole: string;
}

export function ChatMessageListContainer({
  chatRef,
  messageList,
  userId,
  userRole,
}: IChatMessageListContainer) {
  return (
    <div
      ref={chatRef}
      className="m-3 scroll-smooth flex gap-3 flex-col h-full max-h-[75vh] overflow-y-auto p-2"
    >
      <MessageListRender
        messageList={messageList}
        userId={userId}
        userRole={userRole}
      />
    </div>
  );
}

interface IChatTextInput {
  activeRoom: string | null;
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
  return (
    <div className="mt-auto w-full border-t-2">
      <div
        className={classNames(
          { "pointer-events-none opacity-50": !activeRoom },
          "flex flex-row justify-center items-center w-full gap-5 p-4"
        )}
      >
        <textarea
          className="w-full ring-1 h-[2.5rem] leading-[2.4rem] rounded-lg ring-primary whitespace-pre-line resize-none py-2 px-4"
          placeholder={activeRoom ? t("typeMessage") : t("selectRoom")}
          value={messageText}
          onChange={(e) => {
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

interface IRenderRoomList {
  roomList: any[];
  userRole: string;
  userId: string;
  activeRoom: string | null;
  onSelectRoom: (roomId: string) => void;
}

export const RenderRoomList = ({
  roomList,
  userRole,
  userId,
  activeRoom,
  onSelectRoom,
}: IRenderRoomList) => {
  if (!roomList.length) return null;
  return (
    <div className="overflow-y-scroll max-h-[73vh] !h-min">
      {roomList?.map(({ members, _id: RoomId }) => {
        const vipImg = require("../../assets/images/vip.png");

        if (!Object.keys(members).includes(userRole)) return null;

        const otherChatter =
          members?.[
            Object.keys(members).filter(
              (item) => members[item]._id !== userId
            )[0]
          ];
        const img = otherChatter.name.en.includes("VIP")
          ? vipImg
          : otherChatter?.image?.Location;
        return (
          <div
            key={otherChatter?._id}
            className={classNames(
              "flex sm:flex-row items-center gap-3 sm:h-14 max-sm:flex-col",
              "hover:bg-slate-300/80 cursor-pointer",
              "ltr:rounded-l-2xl rtl:rounded-r-2xl px-3 py-2 max-w-full overflow-hidden",
              { "active-room-tab": activeRoom === RoomId }
            )}
            onClick={() => onSelectRoom(RoomId)}
          >
            <div className="w-12 h-12 min-w-[3rem] min-h-[3rem] shrink-0 grow-0 max-w-[3rem] max-h-12 rounded-full flex items-center border bg-slate-200/50 justify-center overflow-hidden">
              {img ? (
                <img
                  src={img}
                  alt=""
                  className="max-h-full max-w-full object-cover h-full w-full"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserTie}
                  size="xl"
                  className="text-slate-800"
                />
              )}
            </div>
            <span className="flex-grow text-lg whitespace-nowrap overflow-hidden text-ellipsis max-sm:text-xs max-sm:whitespace-normal max-sm:leading-3 max-sm:text-center line-clamp-2">
              {getLocalizedWord(otherChatter?.name)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/**********************************************/
