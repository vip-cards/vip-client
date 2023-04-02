import { io } from "socket.io-client";

const URL = process.env.REACT_APP_SOCKET_URL;

export const EVENTS = Object.freeze({
  CONNECTION: {
    OPEN: "connect",
    CLOSE: "disconnect",
  },
  CHAT: {
    GET: "getRoom",
    CREATE: "createRoom",
    LIST: "listRooms",
    MESSAGE: "sendMessageToRoom",
  },
  NOTIFICATION: {
    CREATE: "createNotification",
    LISTEN: "newNotification",
    LIST: "listNotifications",
    MARK_SEEN: "markAsSeen",
  },
});

export const socket = io(URL, {
  autoConnect: false,
});

export function connectSocket() {
  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}
