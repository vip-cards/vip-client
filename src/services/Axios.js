import axios from "axios";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";
import store from "../store";
import { authActions } from "../store/auth-slice";
import endPoint from "./endPoint";

const baseURL = endPoint;

const guestEndpoints = [
  "/vendor/login",
  "/branch/login",
  "/client/login",
  "/client/loginBy",
  "/client/register",
];

const Axios = axios.create({ baseURL });
Axios.defaults.baseURL = endPoint + "/client";
Axios.defaults.headers["x-app-token"] = "VIP-Team";

Axios.interceptors.request.use(async (req) => {
  if (guestEndpoints.includes(req.url)) {
    console.log("loggingig on");
    return req;
  }

  let auth = store.getState().auth;

  const token = jwt_decode(auth.token);

  console.log("itercepting the request", token);

  const isTokenExpired = dayjs.unix(token.exp).diff(dayjs()) <= 1;

  if (!isTokenExpired) {
    console.log("token not expired");
    req.headers.Authorization = `Bearer ${auth.token}`;
    return req;
  }

  if (isTokenExpired) {
    console.log(req, "expired token");
    localStorage.removeItem("token");
    store.dispatch(authActions.logout());

    return Promise.reject("you are unautherised");
  }
});

export default Axios;
