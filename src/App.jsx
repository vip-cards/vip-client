import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkFixLang } from "./helpers/lang";
import i18n from "./locales/i18n";
import Login from "./pages/Login/Login";

import toastPopup from "helpers/toastPopup";
import { Helmet } from "react-helmet-async";
import { Navigate, Route, Routes, useLocation } from "react-router";
import {
  connectSocket,
  disconnectSocket,
  EVENTS,
  socket,
} from "services/socket/config";
import {
  listenToNotification,
  listNotification,
} from "services/socket/notification";
import { setNotifications } from "store/actions";
import Register from "./pages/Register/Register";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import { fetchWishlist } from "./store/wishlist-slice";
import RegisterForm from "./views/RegisterForm/RegisterForm";
import RegisterHome from "./views/RegisterHome/RegisterHome";

function App() {
  let lang = i18n.language;

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    checkFixLang(lang);
  }, [lang]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [auth, dispatch]);

  useEffect(() => {
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    connectSocket();
    socket.on(EVENTS.CONNECTION.OPEN, () => toastPopup.success("connected"));
    listenToNotification((res) => console.log(res));
    listNotification(
      {
        "city.en": "Alexandria",
        // gender: "male",
      },
      (response) => setNotifications(response)
    );
    return () => {
      socket.off(EVENTS.CONNECTION.OPEN);
      disconnectSocket();
    };
  }, []);

  return (
    <div className="App">
      <Helmet>
        <title>VIP</title>
      </Helmet>
      <Routes>
        <Route path="/*" element={<ProtectedRoute />} />

        <Route
          path="/login"
          element={auth.token ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={auth.token ? <Navigate to="/" /> : <Register />}
        >
          <Route index element={<RegisterHome />} />
          <Route path="create" element={<RegisterForm />} />
        </Route>
        <Route
          path="/reset-password"
          element={auth.token ? <Navigate to="/" /> : <ResetPassword />}
        />
      </Routes>
    </div>
  );
}

export default App;
