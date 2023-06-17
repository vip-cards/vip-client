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
import PropTypes from "prop-types";

export const ChatContainer = ({ children }) => (
  <div className="chat-page-container app-card-shadow max-w-[80vw] max-sm:max-w-full max-h-[80vh] max-sm:max-h-full min-w-[300px] mx-auto my-8">
    {children}
  </div>
);

export function ChatSidebar({ children }) {
  return <div className="chat-sidebar max-sm:!w-32">{children}</div>;
}

export function ChatBodyContainer({
  children,
  messageList,
  activeRoom,
  onCreateModal,
}) {
  return (
    <div
      className={classNames("w-full h-full flex flex-col", {
        "bg-slate-200 duration-1000 animate-pulse":
          !messageList?.length && activeRoom,
      })}
    >
      {children}
      <MainButton
        variant="secondary"
        className="whitespace-nowrap bg-white mt-auto w-fit mx-auto text-primary flex flex-row justify-center items-center gap-2 text-sm max-md:!text-xs font-semibold"
        onClick={onCreateModal}
      >
        <FontAwesomeIcon
          icon={faPlusCircle}
          className="max-sm:p-3 max-sm:!text-xl"
        />
        <span className="max-sm:hidden">Create Room</span>
      </MainButton>
    </div>
  );
}

export function MessageListRender({ messageList, userRole, userId }) {
  if (!messageList.length) return null;
  return messageList?.map((message) => (
    <div
      key={message.timestamp}
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

export function ChatMessageListContainer({
  chatRef,
  messageList,
  userId,
  userRole,
}) {
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

export function ChatTextInput({
  activeRoom,
  messageText,
  setMessageText,
  handleSendMessage,
}) {
  return (
    <div className="mt-auto w-full border-t-2">
      <div
        className={classNames(
          { "pointer-events-none opacity-50": !activeRoom },
          "flex flex-row justify-center items-center w-full gap-5 p-4"
        )}
      >
        <input
          className="w-full ring-1 rounded-lg ring-primary py-2 px-4"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyUp={(e) => e.code === "Enter" && handleSendMessage()}
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

export const RenderRoomList = ({
  roomList,
  userRole,
  userId,
  activeRoom,
  onSelectRoom,
}) => {
  if (!roomList.length) return null;
  return (
    <div className=" overflow-y-scroll !h-min">
      {roomList?.map(({ members, _id: RoomId }) => {
        if (!Object.keys(members).includes(userRole)) return null;

        const otherChatter =
          members?.[
            Object.keys(members).filter(
              (item) => members[item]._id !== userId
            )[0]
          ];

        return (
          <div
            key={otherChatter?._id}
            className={classNames(
              "flex sm:flex-row items-center gap-3 sm:h-14 max-sm:flex-col",
              "hover:bg-slate-300/80 cursor-pointer",
              "rounded-l-2xl px-3 py-2 max-w-full overflow-hidden",
              { "active-room-tab": activeRoom === RoomId }
            )}
            onClick={() => onSelectRoom(RoomId)}
          >
            <div className="w-12 h-12 min-w-[3rem] min-h-[3rem] max-w-[3rem] max-h-12 rounded-full flex items-center border bg-slate-200/50 justify-center overflow-hidden">
              {otherChatter?.image ? (
                <img
                  src={otherChatter?.image?.Location}
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

ChatContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
ChatSidebar.propTypes = {
  children: PropTypes.node.isRequired,
};
ChatBodyContainer.propTypes = {
  children: PropTypes.node.isRequired,
  messageList: PropTypes.arrayOf(PropTypes.object),
  activeRoom: PropTypes.bool.isRequired,
  onCreateModal: PropTypes.func.isRequired,
};

ChatBodyContainer.defaultProps = {
  messageList: [],
};
MessageListRender.propTypes = {
  messageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  userRole: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
ChatMessageListContainer.propTypes = {
  chatRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  messageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  userId: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};
ChatTextInput.propTypes = {
  activeRoom: PropTypes.bool.isRequired,
  messageText: PropTypes.string.isRequired,
  setMessageText: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
};
RenderRoomList.propTypes = {
  roomList: PropTypes.arrayOf(PropTypes.object).isRequired,
  userRole: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  activeRoom: PropTypes.string,
  onSelectRoom: PropTypes.func.isRequired,
};

RenderRoomList.defaultProps = {
  activeRoom: null,
};
