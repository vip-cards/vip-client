import Login from "./pages/Login/Login";
import i18n from "./locales/i18n";
import { checkFixLang } from "./helpers/lang";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Navigate, Route, Routes, useLocation } from "react-router";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import { fetchWishlist } from "./store/wishlist-slice";
import Register from "./pages/Register/Register";
import RegisterHome from "./views/RegisterHome/RegisterHome";
import RegisterForm from "./views/RegisterForm/RegisterForm";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { Helmet } from "react-helmet-async";

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
