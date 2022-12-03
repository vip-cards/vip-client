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

        <form
          className="login-box app-card-shadow"
          onSubmit={(e) => e.preventDefault()}
        >
          <p>{t("signUp")}</p>
          <Outlet />
          <p className="login-footer">
            <span>Already Have An Account?</span>
            &nbsp;
            <Link to="/login" className="link-item">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
