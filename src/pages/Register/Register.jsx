import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { switchLang } from "../../helpers/lang";
import { ReactComponent as VendorLogo } from "../../assets/VIP-ICON-SVG/VendorLogo.svg";
import { ReactComponent as VendorLogoOrange } from "../../assets/VIP-ICON-SVG/VendorLogoOrange.svg";

export default function Register() {
  const { t, i18n } = useTranslation();
  function changeLang(lang) {
    i18n.changeLanguage(lang);
    switchLang(lang);
  }

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

        <div
          className="login-box app-card-shadow"
          onSubmit={(e) => e.preventDefault()}
        >
          <p>{t("signUp")}</p>
          <div className="flex flex-col gap-4 justify-center items-center w-full mx-auto">
            <Outlet />
          </div>
          <p className="login-footer">
            <span>{t("alreadyHaveAccount")} </span>
            &nbsp;
            <Link to="/login" className="link-item">
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
