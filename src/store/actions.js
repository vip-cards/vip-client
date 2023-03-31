import store from ".";
import { setNotifications as setNotificationsAction } from "./notification-slice";
const { dispatch } = store;

// notification
export const setNotifications = (data) =>
  dispatch(setNotificationsAction(data));
