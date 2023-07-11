import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toastPopup from "helpers/toastPopup";
import _, { capitalize } from "lodash";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
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
import { ICustomResponse } from "types/global";
import AdminSelectModal from "./_components/AdminSelectModal";
import { ChatBodyContainer } from "./_components/ChatBodyContainer";
import { ChatContainer } from "./_components/ChatContainer";
import { ChatMessageListContainer } from "./_components/ChatMessageListContainer";
import { ChatSidebar } from "./_components/ChatSidebar";
import { ChatTextInput } from "./_components/ChatTextInput";
import { RenderRoomList } from "./_components/RenderRoomList";

import "./Chat.scss";

dayjs.extend(relativeTime);

const { CHAT } = EVENTS;

function Chat() {
  const chatRef = useRef(null);
  const { socket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useSelector(selectAuth);

  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<IRoom>();
  const [excludeRoom, setExcludeRoom] = useState<IRoom["_id"]>("");
  const [messageText, setMessageText] = useState<IMessage["text"]>("");
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { data: adminsList = [] } = useSWR("admin-list", () =>
    chatServices.getAdmins().then((data) => data.record)
  );

  const { state } = location;
  const userId = user.userData._id;
  const userRole = user?.userData?.role ?? user?.userRole;

  const handleCreateRoomModal = () => setIsModalVisible(true);

  const handleCreateAdminRoom = (_id) => {
    createRoom({ admin: _id });
    setIsModalVisible(false);
  };

  const handleSelectRoom = (room: IRoom) => {
    setMessageList([]);
    setMessageText("");

    getRoom(room?._id, (data: { record: IRoom }) => {
      const room: IRoom = data?.record;

      if (!room) return;

      setActiveRoom(room);

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
    if (!_text?.length) return;

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
    listRooms({ [userRole]: userId, page: 1, limit: 20 }, onListRooms);
  }, [userRole, userId]);

  const onSentMessage = useCallback(
    (data: { message: IMessage; _id: IRoom["_id"] }) => {
      const roomId = _.isObject(activeRoom) ? activeRoom._id : activeRoom;

      if (data?._id === roomId) {
        setMessageList((list) => [...list, data.message]);
      } else {
        // Fetch the message list for the current active room
        getRoom(roomId, (data: { record: IRoom }) => {
          const room: IRoom = data?.record;
          if (room) {
            setMessageList(room.messages);
          }
        });
      }
      listRooms({ [userRole]: userId, page: 1, limit: 20 }, onListRooms);
    },
    [activeRoom, userRole, userId, roomList]
  );

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
    socket.on(CHAT.CREATE, onCreateRoom);
    socket.on(CHAT.MESSAGE, onSentMessage);

    listRooms({ [userRole]: userId, page: 1, limit: 20 }, onListRooms);
    return () => {
      socket.off(CHAT.CREATE, onCreateRoom);
      socket.off(CHAT.MESSAGE, onSentMessage);
    };
  }, [socket, userId, onSentMessage, onCreateRoom, userRole]);

  /* update the active room details when the room list is updated */

  return (
    <ChatContainer>
      <Helmet>
        <title>{capitalize(t("chat"))}</title>
      </Helmet>

      {/* --- Sidebar --- */}
      <ChatSidebar onCreateModal={handleCreateRoomModal}>
        <RenderRoomList
          userId={userId}
          userRole={userRole}
          roomList={roomList}
          activeRoom={activeRoom}
          onSelectRoom={handleSelectRoom}
        />
      </ChatSidebar>

      {/* --- Body --- */}
      <ChatBodyContainer
        activeRoom={activeRoom}
        messageList={messageList ?? []}
        onCreateModal={handleCreateRoomModal}
      >
        <ChatMessageListContainer
          userId={userId}
          chatRef={chatRef}
          userRole={userRole}
          messageList={messageList}
        />
        <ChatTextInput
          activeRoom={activeRoom}
          messageText={messageText}
          setMessageText={setMessageText}
          handleSendMessage={handleSendMessage}
        />
      </ChatBodyContainer>

      <AdminSelectModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        adminsList={adminsList}
        handleCreateAdminRoom={handleCreateAdminRoom}
      />
    </ChatContainer>
  );
}

export default Chat;
