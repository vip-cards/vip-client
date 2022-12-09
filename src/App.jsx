import "./App.scss";
import Login from "./pages/Login/Login";
import i18n from "./locales/i18n";
import { checkFixLang, editTitle } from "./helpers/lang";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import { fetchWishlist } from "./store/wishlist-slice";
import Register from "./pages/Register/Register";
import RegisterHome from "./views/RegisterHome/RegisterHome";
import RegisterForm from "./views/RegisterForm/RegisterForm";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

function App() {
  let lang = i18n.language;

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    checkFixLang(lang);
    editTitle(lang);
  }, [lang]);
  //get all
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [auth, dispatch]);

  console.log(auth);

  return (
    <div className="App">
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
