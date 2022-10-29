import i18n from "../locales/i18n";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const toastPopup = {
  error: (text) => {
    const lang = i18n.language;
    toast.error(text, {
      position:
        lang === "ar" ? toast.POSITION.TOP_RIGHT : toast.POSITION.TOP_LEFT,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  },

  success: (text) => {
    const lang = i18n.language;
    toast.success(text, {
      position:
        lang === "ar" ? toast.POSITION.TOP_RIGHT : toast.POSITION.TOP_LEFT,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  },
};

export default toastPopup;
