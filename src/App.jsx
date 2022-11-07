import "./App.scss";
import Login from "./pages/Login/Login";
import i18n from "./locales/i18n";
import { checkFixLang, editTitle, switchLang } from "./helpers/lang";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ClientLayout from "./layouts/ClientLayout/ClientLayout";

function App() {
  let lang = i18n.language;

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    checkFixLang(lang);
    editTitle(lang);
  }, [lang]);

  console.log(auth);

  return <div className="App">{auth.token ? <ClientLayout /> : <Login />}</div>;
}

export default App;
