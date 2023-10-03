import axios from "axios";
import dayjs from "dayjs";
import toastPopup from "helpers/toastPopup";
import jwt_decode from "jwt-decode";
import store from "../store";
import { authActions } from "../store/auth-slice";
import endPoint from "./endPoint";
import i18n from "locales/i18n";

const guestEndpoints = [
  "/login",
  "/loginBy",
  "/loginByBarcode",
  "/register",
  "/recovery",
  "/resetPassword",
  "/guest",
  "/page",
];

const axiosConfig = {
  baseURL: endPoint + "/client",
  headers: { "x-app-token": "VIP-Team", "accept-language": i18n.language },
};

const guestAxios = axios.create(axiosConfig);
const Axios = axios.create(axiosConfig);

Axios.interceptors.request.use(async (req) => {
  if (guestEndpoints.includes(req.url)) return req;

  let auth = store.getState().auth;

  const token = jwt_decode(auth.token);

  const isTokenExpired = dayjs.unix(token.exp).diff(dayjs()) <= 1;

  if (!isTokenExpired) {
    req.headers.Authorization = `Bearer ${auth.token}`;
    if (req.method === "get") {
      const skipped = ["subs", "ad/list", "job/get", "ad/get", "banner/get"];
      let isActive = null;

      for (const url of skipped) {
        if (req.url.includes(url)) {
          isActive = null;
          break;
        }
        isActive = true;
      }
      req.params = {
        ...req.params,
        isActive,
      };
    }
    if (
      req.method !== "get" &&
      token._id === "guest" &&
      !req.url.includes("update") &&
      !req.url.includes("subscribe")
    ) {
      toastPopup.error("You are not allowed untill you subscribe!");
      return Promise.reject("Method not allowed");
    }
    return req;
  } else {
    localStorage.removeItem("token");
    store.dispatch(authActions.logout());

    return Promise.reject("you are unautherised");
  }
});

export function axiosAuthMiddleware() {
  let userId = store.getState().auth.userId;

  const getUserIdPromise = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = store.subscribe(() => {
        const newUserId =
          store.getState().auth.userId ?? localStorage.getItem("userId"); // localStorage as turn-around
        if (newUserId) {
          userId = newUserId;
          unsubscribe();
          resolve();
        }
      });
    });
  };

  const axiosWrapper = async () => {
    // Wait for the `userId` value to be set before making the request
    await getUserIdPromise();
    return Axios;
  };

  return { axiosWrapper, userId };
}

export { guestAxios };
export default Axios;
