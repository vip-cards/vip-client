import { ReactComponent as VendorLogoOrange } from "assets/VIP-ICON-SVG/VendorLogoOrange.svg";
import Modal from "components/Modal/Modal";
import { getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
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
import {
  ChatBodyContainer,
  ChatContainer,
  ChatMessageListContainer,
  ChatSidebar,
  ChatTextInput,
  RenderRoomList,
} from "./_common";

import "./Chat.scss";

const { CHAT } = EVENTS;

function Chat() {
  const chatRef = useRef(null);
  const { socket } = useSocket();
  const { t } = useTranslation();
  const location = useLocation();

  const user = useSelector(selectAuth);

  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<IRoom>();
  const [messageText, setMessageText] = useState("");
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data } = useSWR("admin-list", () => chatServices.getAdmins());

  const { state } = location;
  const userId = user.userData._id;
  const adminsList = data?.record ?? [];
  const userRole = user?.userData?.role ?? user?.userRole;

  const handleCreateRoomModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateAdminRoom = (_id) => {
    createRoom({ admin: _id });
    setIsModalVisible(false);
  };

  const handleSelectRoom = (room: IRoom) => {
    setActiveRoom(room);
    setMessageList([]);
    setMessageText("");
    getRoom(room._id, (data: { record: IRoom }) => {
      const room: IRoom = data.record;
      if (!room) return;
      setMessageList(room.messages);
    });
  };

  const handleSendMessage = () => {
    // Replace multiple spaces at the beginning and end with a single space

    const _text = messageText.trim();
    const normalizedText = _text.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
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
    setRoomList(data.records.filter((record) => record.lastMessage));
  };

  const onCreateRoom = useCallback(() => {
    toastPopup.success("Room Created");
    listRooms({ client: userId, page: 1, limit: 20 }, onListRooms);
  }, [userId]);

  const onSentMessage = (data) => {
    setMessageList((list) => [...list, data.message]);
    listRooms({ client: userId, page: 1, limit: 20 }, onListRooms);
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
    listRooms({ client: userId, page: 1, limit: 20 }, onListRooms);

    socket.on(CHAT.CREATE, onCreateRoom);
    socket.on(CHAT.MESSAGE, onSentMessage);

    return () => {
      socket.off(CHAT.CREATE, onCreateRoom);
      socket.off(CHAT.MESSAGE, onSentMessage);
    };
  }, [onCreateRoom, socket, userId]);

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
