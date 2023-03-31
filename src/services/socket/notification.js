import store from "../../store";
import { EVENTS, socket } from "./config";

export function markAsSeen(notificationId) {
  const auth = store.getState().auth;
  const role = auth.userData?.role || auth.role || "";
  console.log({
    notification: notificationId,
    [role]: auth.userData._id,
    connected: socket.connected,
  });
  socket.emit(
    EVENTS.NOTIFICATION.MARK_SEEN,
    {
      notification: notificationId,
      [role]: auth.userData._id,
    },
    (res) => console.log(res)
  );
  socket.on(EVENTS.NOTIFICATION.MARK_SEEN, (res) => console.log(res));
}

export function listenToNotification(onEvent) {
  socket.on(EVENTS.NOTIFICATION.LISTEN, onEvent);
}

export function listNotification(obj, onEvent) {
  socket.emit(EVENTS.NOTIFICATION.LIST, obj);
  socket.on(EVENTS.NOTIFICATION.LIST, onEvent);
}
