import "./App.scss";
import Login from "./pages/Login/Login";
import i18n from "./locales/i18n";
import { checkFixLang, editTitle } from "./helpers/lang";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";

function App() {
  let lang = i18n.language;

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    checkFixLang(lang);
    editTitle(lang);
  }, [lang]);

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
