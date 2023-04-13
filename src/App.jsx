import { checkFixLang } from "helpers/lang";
import i18n from "locales/i18n";
import Login from "pages/Login/Login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Register from "pages/Register/Register";
import ResetPassword from "pages/ResetPassword/ResetPassword";
import { Helmet } from "react-helmet-async";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import ProtectedRoute from "routes/ProtectedRoute/ProtectedRoute";
import {
  EVENTS,
  connectSocket,
  disconnectSocket,
  socket,
} from "services/socket/config";
import {
  listNotification,
  listenToNotification,
} from "services/socket/notification";
import { setNotifications } from "store/actions";
import { fetchWishlist } from "store/wishlist-slice";
import RegisterForm from "views/RegisterForm/RegisterForm";
import RegisterHome from "views/RegisterHome/RegisterHome";
import ForgetPassword from "pages/Login/ForgotPassword";
import { ROUTES } from "constants";

function App() {
  const lang = i18n.language;

  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();
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
    listenToNotification((first) => {});
    socket.on(EVENTS.CONNECTION.OPEN, () => {});
    listenToNotification((res) => {});
    listNotification();

    socket.on(EVENTS.NOTIFICATION.LIST, (response) =>
      setNotifications(response)
    );

    socket.on(EVENTS.CHAT.CREATE, (res) => {
      if (!res.success) {
        return;
      }
      const roomId = res.record?._id;
      navigate("/chat", { state: { roomId } });
    });
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
          path={ROUTES.FORGOT_PASSWORD}
          element={auth.token ? <Navigate to="/" /> : <ForgetPassword />}
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
