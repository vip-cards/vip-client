import toastPopup from "helpers/toastPopup";
import store from "store";
import { EVENTS, socket } from "./config";

export function createRoom(reciever) {
  const userId = store.getState().auth.userId;
  socket.emit(EVENTS.CHAT.CREATE, { members: { client: userId, ...reciever } });
}

export function getRoom(_id, onEvent) {
  socket.emit(EVENTS.CHAT.GET, { _id });
  socket.once(EVENTS.CHAT.GET, onEvent);
}

export function listRooms(members, onEvent) {
  socket.emit(EVENTS.CHAT.LIST, { members });
  socket.once(EVENTS.CHAT.LIST, onEvent);
}

export function sendMessage(message) {
  if (socket.connected) {
    socket.emit(EVENTS.CHAT.MESSAGE, message);
  } else {
    toastPopup.error("Not Connected!");
  }
}
