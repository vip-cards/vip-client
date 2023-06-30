import store from "store";
import { EVENTS, socket } from "./config";

export function markAsSeen(notificationId) {
  const auth = store.getState().auth;
  const role = auth.userData?.role || auth.role || "";

  socket.emit(EVENTS.NOTIFICATION.MARK_SEEN, {
    notification: notificationId,
    [role]: auth.userData._id,
  });
  socket.on(EVENTS.NOTIFICATION.MARK_SEEN, listNotification());
}

export function listenToNotification(onEvent) {
  socket.on(EVENTS.NOTIFICATION.LISTEN, onEvent);
}

export function listNotification() {
  socket.emit(EVENTS.NOTIFICATION.LIST, {});
}
