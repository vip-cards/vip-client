import axios from "axios";
import dayjs from "dayjs";
import toastPopup from "helpers/toastPopup";
import jwt_decode from "jwt-decode";
import store from "../store";
import { authActions } from "../store/auth-slice";
import endPoint from "./endPoint";

const baseURL = endPoint;

const guestEndpoints = [
  "/login",
  "/loginBy",
  "/register",
  "/recovery",
  "/resetPassword",
  "/guest",
];

const Axios = axios.create({ baseURL });
Axios.defaults.baseURL = endPoint + "/client";
Axios.defaults.headers["x-app-token"] = "VIP-Team";

Axios.interceptors.request.use(async (req) => {
  if (guestEndpoints.includes(req.url)) return req;

  let auth = store.getState().auth;

  const token = jwt_decode(auth.token);

  const isTokenExpired = dayjs.unix(token.exp).diff(dayjs()) <= 1;

  if (!isTokenExpired) {
    req.headers.Authorization = `Bearer ${auth.token}`;
    if (req.method === "get") {
      req.params = {
        ...req.params,
        isActive: req.url.includes("subs") ? false : true,
      };
    }
    if (
      req.method !== "get" &&
      (token._id === "guest" || !auth.userData.isSubscribed) &&
      !req.url.includes("update")
    ) {
      console.log(req.url);
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

export default Axios;
