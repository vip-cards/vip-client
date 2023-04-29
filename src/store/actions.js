import store from ".";
import { authActions } from "./auth-slice";
import { setNotifications as setNotificationsAction } from "./notification-slice";
const { dispatch } = store;

// notification
export const setNotifications = (data) =>
  dispatch(setNotificationsAction(data));

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userData");
  dispatch(authActions.logout());
};
