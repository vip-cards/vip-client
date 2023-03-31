import toastPopup from "app/utils/toastPopup";
import { EVENTS, socket } from "./config";

export function createRoom(members) {
  socket.emit(EVENTS.CHAT.CREATE, { members });
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
  console.log(socket.connected);

  if (socket.connected) {
    socket.emit(EVENTS.CHAT.MESSAGE, message);
  } else {
    toastPopup.error("Not Connected!");
  }
}
