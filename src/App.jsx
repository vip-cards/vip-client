import "./App.scss";
import Login from "./pages/Login/Login";
import i18n from "./locales/i18n";
import { checkFixLang, editTitle, switchLang } from "./helpers/lang";
import { useEffect } from "react";
import VendorLayout from "./layouts/VendorLayout/VendorLayout";
import { useSelector } from "react-redux";
import BranchLayout from "./layouts/BranchLayout/BranchLayout";
function App() {
  let lang = i18n.language;

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    checkFixLang(lang);
    editTitle(lang);
  }, [lang]);

  console.log(auth);

  function layout() {
    if (auth.userRole === "vendor") {
      return <VendorLayout />;
    } else if (auth.userRole === "branch") {
      return <BranchLayout />;
    }
  }
  return <div className="App">{auth.token ? layout() : <Login />}</div>;
}

export default App;
