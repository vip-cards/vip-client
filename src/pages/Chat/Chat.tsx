import { ReactComponent as VendorLogoOrange } from "assets/VIP-ICON-SVG/VendorLogoOrange.svg";
import Modal from "components/Modal/Modal";
import { getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { chatServices } from "services/modules/chatServices";
import {
  createRoom,
  getRoom,
  listRooms,
  sendMessage,
} from "services/socket/chat";
import { EVENTS } from "services/socket/config";
import { useSocket } from "services/socket/provider";
import { selectAuth } from "store/auth-slice";
import useSWR from "swr";

import "./Chat.scss";
import { ChatBodyContainer } from "./_components/ChatBodyContainer";
import { ChatContainer } from "./_components/ChatContainer";
import { ChatMessageListContainer } from "./_components/ChatMessageListContainer";
import { ChatSidebar } from "./_components/ChatSidebar";
import { ChatTextInput } from "./_components/ChatTextInput";
import { RenderRoomList } from "./_components/RenderRoomList";
import { ICustomResponse } from "types/global";

const { CHAT } = EVENTS;

function Chat() {
  const chatRef = useRef(null);
  const { socket } = useSocket();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectAuth);

  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<IRoom>();
  const [excludeRoom, setExcludeRoom] = useState<IRoom["_id"]>("");
  const [messageText, setMessageText] = useState<IMessage["text"]>("");
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { data } = useSWR("admin-list", () => chatServices.getAdmins());

  const { state } = location;
  const userId = user.userData._id;
  const adminsList = data?.record ?? [];
  const userRole = user?.userData?.role ?? user?.userRole;

  const handleCreateRoomModal = () => setIsModalVisible(true);

  const handleCreateAdminRoom = (_id) => {
    createRoom({ admin: _id });
    setIsModalVisible(false);
  };

  const handleSelectRoom = (room: IRoom) => {
    setActiveRoom(room);
    setMessageList([]);
    setMessageText("");
    getRoom(room?._id, (data: { record: IRoom }) => {
      const room: IRoom = data.record;
      if (!room) return;

      if (room._id === state?.room?._id) return setMessageList(room.messages);
      navigate("", { state: { room } });
    });
  };

  const handleSendMessage = () => {
    // Replace multiple spaces at the beginning and end with a single space
    const _text = messageText.trim();
    const normalizedText = _text
      .replace(/^\s+|\s+$/g, "")
      .replace(/[^\S\n]+/g, " ");
    if (!_text || !_text.length) return;

    const message = {
      _id: activeRoom._id,
      message: {
        text: normalizedText,
        timestamp: new Date().toISOString(),
        client: userId,
      } as Omit<IMessage, "_id">,
    };
    sendMessage(message);
    setMessageText("");
  };

  const onListRooms = (data: ICustomResponse<IRoom>["data"]) => {
    const { records } = data;
    if (!records?.length) return;

    const isListed = (record: IRoom) =>
      record.lastMessage || record._id === excludeRoom;

    setRoomList(records.filter(isListed));
  };

  const onCreateRoom = useCallback(() => {
    toastPopup.success("Room Created");
    listRooms({ client: userId, page: 1, limit: 20 }, onListRooms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, excludeRoom]);

  const onSentMessage = (data: { message: IMessage }) => {
    setMessageList((list) => [...list, data.message]);
    listRooms({ client: userId, page: 1, limit: 20 }, onListRooms);
  };

  /* scroll to the bottom of chat when fetching the message list */
  useEffect(() => {
    if (chatRef?.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messageList]);

  /* select room and exclude it from being hidden, when navigate to chat module */
  useEffect(() => {
    if (state?.room) {
      setExcludeRoom(state.room._id);
      handleSelectRoom(state.room);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  /* listen to creating rooms and sending messages with socket */
  useEffect(() => {
    listRooms({ client: userId, page: 1, limit: 20 }, onListRooms);

    socket.on(CHAT.CREATE, onCreateRoom);
    socket.on(CHAT.MESSAGE, onSentMessage);

    return () => {
      socket.off(CHAT.CREATE, onCreateRoom);
      socket.off(CHAT.MESSAGE, onSentMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, userId]);

  /* update the active room details when the room list is updated */
  useEffect(() => {
    if (activeRoom?._id) {
      setActiveRoom(roomList.find((room) => room._id === activeRoom._id));
    }
  }, [activeRoom, roomList]);

  return (
    <ChatContainer>
      <ChatSidebar onCreateModal={handleCreateRoomModal}>
        <RenderRoomList
          activeRoom={activeRoom}
          onSelectRoom={handleSelectRoom}
          roomList={roomList}
          userRole={userRole}
          userId={userId}
        />
      </ChatSidebar>
      <ChatBodyContainer
        messageList={messageList ?? []}
        activeRoom={activeRoom}
        onCreateModal={handleCreateRoomModal}
      >
        <ChatMessageListContainer
          {...{ chatRef, messageList, userId, userRole }}
        />
        <ChatTextInput
          activeRoom={activeRoom}
          handleSendMessage={handleSendMessage}
          messageText={messageText}
          setMessageText={setMessageText}
        />
      </ChatBodyContainer>
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
          {/* Parent Agent */}
        </div>
      </Modal>
    </ChatContainer>
  );
}

export default Chat;
