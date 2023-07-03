import store from "store";
import { EVENTS, socket } from "./config";

export async function newOrderRequest(requestId) {
  const response = await socket.emitWithAck(EVENTS.ORDER.NEW_REQUEST, {
    requestId,
  });
}

export function openOrderRoom(onEvent) {
  const userId = store.getState().auth.userId;

  socket.emit(EVENTS.ORDER.OPEN_ORDER_ROOM, { client: userId });

  socket.on(EVENTS.ORDER.FETCH_ORDER_ROOM, onEvent);
}

// export function listenToUpdate(onEvent){
//   socket.on(EVENTS.ORDER.FETCH_ORDER_ROOM, onEvent);
// }
