import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import endPoint from "./endPoint";
import { authActions } from "../store/auth-slice";
import store from "../store";

const baseURL = endPoint;

const Axios = axios.create({ baseURL });
Axios.defaults.baseURL = endPoint;
Axios.defaults.headers["x-app-token"] = "VIP-Team";

Axios.interceptors.request.use(async (req) => {
  if (req.url === "/vendor/login") {
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
