import React, { useState } from "react";

import { ReactComponent as VendorLogo } from "../../assets/VIP-ICON-SVG/VendorLogo.svg";
import { ReactComponent as VendorLogoOrange } from "../../assets/VIP-ICON-SVG/VendorLogoOrange.svg";

import { useTranslation } from "react-i18next";
import { switchLang } from "../../helpers/lang";
import { MainInput } from "components/Inputs";
import { MainButton } from "components/Buttons";

export default function ResetPassword() {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    email: "",
  });

  const formData = { name: "email", type: "email", required: true };

  function changeLang(lang) {
    i18n.changeLanguage(lang);
    switchLang(lang);
  }

  const sendResetRequest = async (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="login">
      <div className="login-logo">
        <VendorLogo className="admin-login-logo" />
      </div>

      <div className="login-form">
        <div className="app-logo-small">
          <VendorLogoOrange className="login-logo-small" />
        </div>

        <div className="lang">
          {localStorage.getItem("i18nextLng") === "en" ? (
            <button onClick={() => changeLang("ar")}>العربية</button>
          ) : (
            <button onClick={() => changeLang("en")}>English</button>
          )}
        </div>

        <form className="login-box app-card-shadow" onSubmit={sendResetRequest}>
          <p>{t("resetPassword")}</p>

          <MainInput
            name={formData.name}
            type={formData.type}
            required={formData.required}
            state={user}
            setState={setUser}
          />

          <MainButton text={t("send")} loading={loading} type="submit" />
        </form>
      </div>
    </div>
  );
}
