import {
  faClock,
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
import { motion } from "framer-motion";
import { MainImage } from "components";

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
    <div className="chat-sidebar !pt-8 max-sm:!w-32 w-[25vw] max-w-[240px] flex-shrink-0 max-sm:!px-0 rtl:!pr-3 rtl:!pl-0">
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
  activeRoom?: IRoom;
  onCreateModal: () => void;
}

export function ChatBodyContainer({
  children,
  messageList,
  activeRoom,
}: IChatBodyContainer) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  return (
    <div
      className={classNames("w-full h-full flex flex-col overflow-hidden", {
        "bg-slate-200 duration-1000 animate-pulse":
          !messageList?.length && activeRoom?._id,
      })}
    >
      <div
        className={classNames(
          "bg-primary text-white/70 gap-3 text-xs w-full h-8 !opacity-100 shrink-0 min-h-8 flex justify-start items-end",
          { "!hidden": !activeRoom?._id }
        )}
      >
        <span className="first-letter:capitalize">{t("last update")}</span>
        <time>
          {" "}
          {activeRoom?.lastUpdated &&
            (dayjs(activeRoom?.lastUpdated).isBefore(dayjs().subtract(3, "day"))
              ? dayjs(activeRoom?.lastUpdated)
                  .locale(lang)
                  .format("DD-MM-YYYY hh:mm a")
              : dayjs(activeRoom?.lastUpdated).locale(lang).fromNow() + " ...")}
        </time>
      </div>
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
    <motion.div
      key={message.timestamp ?? new Date().toISOString() + Math.random() * 10}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
      layoutScroll
      exit={{ opacity: 0, scale: 0.8 }}
      className={classNames("py-3 px-5 rounded max-w-[80%]", {
        "bg-slate-600 ml-auto w-fit rounded-l-3xl rounded-tr-3xl text-slate-100":
          message[userRole] === userId || message[userRole]?._id === userId,
        "bg-slate-300 mr-auto w-fit rounded-r-3xl rounded-bl-3xl text-slate-900":
          !(message[userRole] === userId || message[userRole]?._id === userId),
      })}
    >
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col"
      >
        <span className="whitespace-pre-line break-words max-w-full overflow-hidden">
          {message.text}
        </span>
        <span className="text-xs self-end text-slate-400 leading-3 whitespace-pre">
          {message.timestamp
            ? dayjs(message.timestamp).format("DD-MM-YYYY hh:mma")
            : null}
        </span>
      </motion.div>
    </motion.div>
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
  return (
    <div className="mt-auto w-full border-t-2">
      <div
        className={classNames(
          { "pointer-events-none opacity-50": !activeRoom?._id },
          "flex flex-row justify-center items-center w-full gap-5 p-4"
        )}
      >
        <textarea
          className="w-full ring-1 h-[2.5rem] leading-[2.4rem] rounded-lg ring-primary whitespace-pre-line resize-none py-2 px-4"
          placeholder={activeRoom?._id ? t("typeMessage") : t("selectRoom")}
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
  roomList: IRoom[];
  userRole: string;
  userId: string;
  activeRoom?: IRoom;
  onSelectRoom: (room: IRoom) => void;
}

export const RenderRoomList = ({
  roomList,
  userRole,
  userId,
  activeRoom,
  onSelectRoom,
}: IRenderRoomList) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  if (!roomList.length) return null;

  return (
    <motion.div
      layoutScroll
      className="overflow-y-auto max-h-[73vh] max-w-full !h-min"
    >
      {roomList?.map((room, idx) => {
        const { members, _id: RoomId, lastUpdated, lastMessage } = room;
        const vipImg = require("../../assets/images/vip.png");

        if (!Object.keys(members).includes(userRole)) return null;

        const otherChatter: IChatter =
          members?.[
            Object.keys(members).filter(
              (item) => members[item]._id !== userId
            )[0]
          ];

        const img = otherChatter.name.en.includes("VIP")
          ? vipImg
          : otherChatter?.image?.Location;

        return (
          <motion.div
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.1, delay: idx * 0.03 }}
            key={otherChatter?._id}
            className={classNames(
              "flex sm:flex-row max-w-full overflow-hidden text-ellipsis items-center gap-3 sm:h-20 max-sm:flex-col",
              "hover:bg-slate-300/80 cursor-pointer transition-all duration-100 ease-in-out",
              "ltr:rounded-l-2xl rtl:rounded-r-2xl px-3 py-2 max-w-full overflow-hidden max-sm:!rounded-none",
              { "active-room-tab": activeRoom?._id === RoomId }
            )}
            onClick={() => onSelectRoom(room)}
          >
            <div className="w-9 h-9 md:w-11 md:h-11 shrink-0 grow-0 max-w-[3rem] max-h-12 rounded-full flex items-center border bg-slate-200/50 justify-center overflow-hidden">
              {img ? (
                <MainImage
                  src={img}
                  alt={getLocalizedWord(otherChatter.name)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserTie}
                  size="xl"
                  className="text-slate-800"
                />
              )}
            </div>
            <div className="flex w-full flex-col h-full justify-between">
              <span className="flex-grow w-full text-lg whitespace-nowrap overflow-hidden text-ellipsis max-sm:text-xs max-sm:whitespace-normal max-sm:leading-3 max-sm:text-center line-clamp-2">
                {getLocalizedWord(otherChatter?.name)}
              </span>
              <span className="flex-grow text-xs w-full text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis max-sm:text-[0.6rem] max-sm:whitespace-normal max-sm:leading-3 text-start line-clamp-1">
                <FontAwesomeIcon icon={faPaperPlane} className="me-1" />

                {lastMessage.text}
              </span>
              <span className="mt-auto text-xs whitespace-nowrap text-slate-600 leading-3">
                <FontAwesomeIcon icon={faClock} className="me-1" />
                {dayjs(lastUpdated).isBefore(dayjs().subtract(3, "day"))
                  ? dayjs(lastUpdated).locale(lang).format("DD-MM-YYYY")
                  : dayjs(lastUpdated).locale(lang).fromNow()}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

/**********************************************/
