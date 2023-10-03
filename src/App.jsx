import { ROUTES } from "constants";
import { checkFixLang } from "helpers/lang";
import i18n from "locales/i18n";
import ForgetPassword from "pages/Login/ForgotPassword";
import Login from "pages/Login/Login";
import Register from "pages/Register/Register";
import ResetPassword from "pages/ResetPassword/ResetPassword";
import Support from "pages/Support/Support";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router";
import ProtectedRoute from "routes/ProtectedRoute/ProtectedRoute";
import { SocketProvider } from "services/socket/provider";
import { fetchWishlist } from "store/wishlist-slice";
import RegisterForm from "views/RegisterForm/RegisterForm";
import RegisterHome from "views/RegisterHome/RegisterHome";

function App() {
  const lang = i18n.language;

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

  return (
    <div className="App">
      <Helmet>
        <title>VIP</title>
      </Helmet>

      <Routes>
        <Route
          path="/*"
          element={
            <SocketProvider>
              <ProtectedRoute />
            </SocketProvider>
          }
        />

        <Route
          path="/login"
          element={auth.token ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/support" element={<Support />} />
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
