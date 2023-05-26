import toastPopup from "helpers/toastPopup";
import store from "store";
import { EVENTS, socket } from "./config";

export function newOrderRequest(requestId) {
  socket.emit(EVENTS.ORDER.NEW_REQUEST, { requestId });
}

export function openOrderRoom(onEvent) {
  const userId = store.getState().auth.userId;

  socket.emit(EVENTS.ORDER.OPEN_ORDER_ROOM, { client: userId });

  socket.on(EVENTS.ORDER.FETCH_ORDER_ROOM, onEvent);
}
