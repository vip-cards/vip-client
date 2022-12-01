import "./App.scss";
import Login from "./pages/Login/Login";
import i18n from "./locales/i18n";
import { checkFixLang, editTitle } from "./helpers/lang";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import { fetchWishList } from "./store/wishlist-slice";

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
    dispatch(fetchWishList());
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
      </Routes>
    </div>
  );
}

export default App;
