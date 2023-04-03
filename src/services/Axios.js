import axios from "axios";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";
import store from "../store";
import { authActions } from "../store/auth-slice";
import endPoint from "./endPoint";

const baseURL = endPoint;

const guestEndpoints = ["/login", "/loginBy", "/register"];

const Axios = axios.create({ baseURL });
Axios.defaults.baseURL = endPoint + "/client";
Axios.defaults.headers["x-app-token"] = "VIP-Team";

Axios.interceptors.request.use(async (req) => {
  if (guestEndpoints.includes(req.url)) {

    return req;
  }

  let auth = store.getState().auth;

  const token = jwt_decode(auth.token);

  const isTokenExpired = dayjs.unix(token.exp).diff(dayjs()) <= 1;

  if (!isTokenExpired) {
    req.headers.Authorization = `Bearer ${auth.token}`;
    return req;
  }

  if (isTokenExpired) {
    localStorage.removeItem("token");
    store.dispatch(authActions.logout());

    return Promise.reject("you are unautherised");
  }
});

export default Axios;
