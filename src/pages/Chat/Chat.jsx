import {
  faPaperPlane,
  faUser,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import Modal from "components/Modal/Modal";
import { API_STATUS } from "constants";
import { getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { chatServices } from "services/modules/chatServices";
import {
  createRoom,
  getRoom,
  listRooms,
  sendMessage,
} from "services/socket/chat";
import { EVENTS, socket } from "services/socket/config";
import { selectAuth } from "store/auth-slice";
import "./Chat.scss";
import dayjs from "dayjs";

const { CHAT, CONNECTION } = EVENTS;

function Chat() {
  const chatRef = useRef(null);
  const user = useSelector(selectAuth);
  const location = useLocation();
  const { state } = location;

  const [adminsList, setAdminsList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [subAgents, setSubAgents] = useState([]);
  const [status, setStatus] = useState(API_STATUS.IDLE);

  const [messageList, setMessageList] = useState([]);
  const [activeRoom, setActiveRoom] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreateRoomModal = () => {
    setIsModalVisible(true);
    setStatus(API_STATUS.LOADING);
    // agentServices.listAllAgents({ parent: user.userData._id }).then(({ record }) => {
    //   setSubAgents(record);
    //   setStatus(API_STATUS.SUCCESS);
    // });
  };

  const handleCreateAdminRoom = (_id) => {
    createRoom({ admin: _id });
    setIsModalVisible(false);
  };

  const handleSelectRoom = (_id) => {
    setActiveRoom(_id);
    setMessageList([]);
    getRoom(_id, (data) => {
      setMessageList(data.record?.messages);
    });
  };

  const handleSendMessage = () => {
    const message = {
      _id: activeRoom,
      message: {
        text: messageText,
        timestamp: new Date().toISOString(),
        client: user.userData._id,
      },
    };
    sendMessage(message);
    setMessageText("");
  };

  const onListRooms = (data) => {
    setRoomList(data.records);
  };

  const onCreateRoom = (data) => {
    toastPopup.success("Room Created");
    listRooms({ client: user.userData._id, page: 1, limit: 20 }, onListRooms);
  };

  const onSentMessage = (data) => {
    if (socket.recovered) {
      // recovery was successful: socket.id, socket.rooms and socket.data were restored
    } else {
      // new or unrecoverable session
    }
    setMessageList((list) => [...list, data.message]);
  };

  useEffect(() => {
    if (chatRef && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messageList]);

  useEffect(() => {
    if (state?.roomId) {
      handleSelectRoom(state.roomId);
    }
  }, [state]);

  useEffect(() => {
    listRooms({ client: user.userData._id, page: 1, limit: 20 }, onListRooms);
    chatServices.getAdmins().then((data) => setAdminsList(data.record));
    socket.on(CHAT.CREATE, onCreateRoom);
    socket.on(CHAT.MESSAGE, onSentMessage);
    socket.on(CONNECTION.OPEN, () => {
      if (socket.recovered) {
        toastPopup.error("Restored");
        // any missed packets will be received
      } else {
        // new or unrecoverable session
      }
    });

    return () => {
      socket.off(CHAT.CREATE, onCreateRoom);
      socket.off(CHAT.MESSAGE, onSentMessage);
    };
  }, []);

  return (
    <div className="chat-page-container app-card-shadow max-w-[80vw] max-h-[80vh] min-w-[300px] mx-auto my-8">
      <div className="chat-sidebar">
        {!!roomList.length &&
          roomList?.map(({ members, _id: RoomId }) => {
            const otherChatter =
              members[
                Object.keys(members).filter(
                  (item) => members[item]._id !== user.userData._id
                )[0]
              ];

            return (
              <div
                key={otherChatter._id}
                className={classNames(
                  "flex flex-row items-center gap-3",
                  "hover:bg-slate-300/80 cursor-pointer",
                  "rounded-l-2xl px-3 py-2 max-w-full overflow-hidden",
                  { "active-room-tab": activeRoom === RoomId }
                )}
                onClick={() => handleSelectRoom(RoomId)}
              >
                <span className="w-12 flex items-center border bg-slate-200/50 justify-center aspect-square rounded-2xl overflow-hidden">
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
                </span>
                <span className="flex-grow text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                  {getLocalizedWord(otherChatter?.name)}
                </span>
              </div>
            );
          })}
        <MainButton
          variant="secondary"
          className="whitespace-nowrap bg-white mt-auto w-fit mx-auto"
          onClick={handleCreateRoomModal}
        >
          Create Room
        </MainButton>
      </div>
      <div
        className={classNames("w-full h-full flex flex-col", {
          "bg-slate-200 duration-1000 animate-pulse":
            !messageList.length && activeRoom,
        })}
      >
        <div
          ref={chatRef}
          className="m-3 scroll-smooth flex gap-3 flex-col h-full max-h-[75vh] overflow-y-auto p-2 "
        >
          {!!messageList.length &&
            messageList?.map((message) => (
              <div
                key={
                  message.timetamp ??
                  new Date().toISOString() + Math.random() * 10
                }
                className={classNames("py-3 px-5 rounded", {
                  "bg-slate-600 ml-auto w-fit rounded-l-full rounded-tr-full text-slate-100":
                    message.client === user.userData._id ||
                    message.client?._id === user.userData._id,
                  "bg-slate-300 mr-auto w-fit rounded-r-full rounded-bl-full text-slate-900":
                    !(
                      message.client === user.userData._id ||
                      message.client?._id === user.userData._id
                    ),
                })}
              >
                <div className="flex flex-col">
                  <span>{message.text}</span>
                  <span className="text-xs self-end text-slate-400">
                    {message.timestamp
                      ? dayjs(message.timestamp).format("DD-MM-YYYY h:m a")
                      : null}
                  </span>
                </div>
              </div>
            ))}
        </div>
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
      </div>
      <Modal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Available to chat"
        className="max-h-48 overflow-auto p-3"
      >
        <div className="chat-modal">
          {/* Admin */}
          {!!adminsList.length &&
            adminsList?.map((admin) => (
              <button
                onClick={() => handleCreateAdminRoom(admin?._id)}
                key={admin._id + "-item"}
                className="flex-row w-full flex-nowrap flex items-center gap-3 hover:ring border-2 px-3 py-1 rounded-xl"
              >
                <span className="w-12 flex  items-center border bg-slate-200/50 justify-center aspect-square rounded-3xl overflow-hidden">
                  <FontAwesomeIcon
                    icon={faUserTie}
                    size="xl"
                    className="text-slate-800"
                  />
                </span>
                <span className="flex-grow text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                  {getLocalizedWord(admin?.name)}
                </span>
              </button>
            ))}
          {/* Parent Agent */}
        </div>
      </Modal>
    </div>
  );
}

export default Chat;
