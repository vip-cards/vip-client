import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as VendorLogo } from "assets/VIP-ICON-SVG/VendorLogo.svg";
import { ReactComponent as VendorLogoOrange } from "assets/VIP-ICON-SVG/VendorLogoOrange.svg";
import { ReactComponent as FacebookLogo } from "assets/icons/facebook.svg";
import { ReactComponent as GoogleLogo } from "assets/icons/google.svg";
import { ReactComponent as TwitterLogo } from "assets/icons/twitter.svg";
import { MainButton } from "components/Buttons";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import { ROUTES } from "constants";
import { getInitialFormData } from "helpers/forms";
import { loginFormData, loginSchema } from "helpers/forms/login";
import { switchLang } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import clientServices from "services/clientServices";
import { useSocialLogin } from "services/firebaseServices";
import { authActions } from "store/auth-slice";
import "./Login.scss";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socialLogin = useSocialLogin();

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [qrCode, setQrCode] = useState({ open: false, code: "" });
  const [user, setUser] = useState(getInitialFormData(loginFormData));

  function handleLoginCatch(e) {
    setLoading(false);
    setErrorList([e.response?.data?.error]);
  }

  function handleLoginSuccess(data) {
    setLoading(false);
    toastPopup.success(t("Success"));
    const tokenDecoded = jwt_decode(data.token);
    dispatch(
      authActions.login({
        token: data.token,
        userId: tokenDecoded._id,
        userRole: tokenDecoded.role,
        userData: data.record ?? tokenDecoded,
      })
    );
    navigate("/");
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    setErrorList([]);
    const { error, value } = loginSchema.validate(user);
    setLoading(true);

    if (!error) {
      return clientServices
        .login(value)
        .then(({ data }) => {
          handleLoginSuccess(data);
        })
        .catch(handleLoginCatch);
    }

    setLoading(false);
    setErrorList(error.details.map((e) => e.message));
  };

  const guestLoginHandler = async (e) => {
    e.preventDefault();
    setErrorList([]);
    setLoading(true);
    clientServices
      .loginAsGuest()
      .then(({ data }) => {
        handleLoginSuccess(data);
      })
      .catch(handleLoginCatch);
  };

  const codeLoginHandler = async () => {
    setErrorList([]);
    if (!qrCode.open) {
      setQrCode((s) => ({ ...s, open: true }));
    } else {
      setLoading(true);
      clientServices
        .loginByCode(qrCode.code)
        .then(({ data }) => {
          handleLoginSuccess(data);
        })
        .catch(handleLoginCatch);
    }
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
            <button onClick={() => switchLang("ar")}>العربية</button>
          ) : (
            <button onClick={() => switchLang("en")}>English</button>
          )}
        </div>

        <form
          className="login-box app-card-shadow max-xs:!w-full max-xs:!shadow-none"
          onSubmit={loginHandler}
          noValidate
        >
          <p>{t("login")}</p>

          {loginFormData.map((formInput, index) => {
            return (
              <MainInput
                {...formInput}
                key={formInput.name}
                state={user}
                setState={setUser}
              />
            );
          })}
          <FormErrorMessage errorList={errorList} />
          <MainButton text={t("login")} loading={loading} type="submit" />
          {qrCode.open && (
            <MainInput
              type="text"
              state={qrCode}
              setState={setQrCode}
              name="code"
            />
          )}
          <MainButton
            onClick={codeLoginHandler}
            className="!bg-secondary/80 hover:!bg-secondary !text-white"
            text={"loginByCode"}
            loading={loading}
            type="button"
          />
          <div className="text-primary hover:opacity-80 capitalize">
            <Link to={`/${ROUTES.FORGOT_PASSWORD}`}>{t("forgotPassword")}</Link>
          </div>

          {/*---------SOCIAL MEDIA BUTTONS---------*/}
          <div className="flex flex-row max-w-full gap-4 justify-around">
            <MainButton
              type="button"
              className="!p-0 !m-0 !h-fit !w-fit !bg-transparent !rounded-full active:scale-95 transition-transform hover:drop-shadow-lg"
              loading={loading}
              onClick={() => socialLogin("google")}
            >
              <GoogleLogo className="w-12 h-12 lg:w-16 lg:h-16" />
            </MainButton>
            <MainButton
              type="button"
              className="!p-0 !m-0 !h-fit !w-fit !bg-transparent !rounded-full active:scale-95 transition-transform hover:drop-shadow-lg"
              loading={loading}
              onClick={() => socialLogin("facebook")}
            >
              <FacebookLogo className="w-12 h-12 lg:w-16 lg:h-16" />
            </MainButton>
            <MainButton
              type="button"
              className="!p-0 !m-0 !h-fit !w-fit !bg-transparent !rounded-full active:scale-95 transition-transform hover:drop-shadow-lg"
              loading={loading}
              onClick={() => socialLogin("twitter")}
            >
              <TwitterLogo className="w-12 h-12 lg:w-16 lg:h-16" />
            </MainButton>
          </div>

          {/*---------FOOTER---------*/}
          <p className="login-footer flex flex-row gap-3 flex-wrap justify-center">
            <span className="whitespace-nowrap">{t("notRegistered")}</span>

            <Link to="/register" className="link-item whitespace-nowrap">
              {t("CreateAccount")}
            </Link>
          </p>
          <div>
            <button
              className="text-primary hover:text-primary/70 transition-colors flex flex-row justify-center items-center gap-2"
              onClick={guestLoginHandler}
            >
              <FontAwesomeIcon icon={faCircleRight} />
              <span>{t("loginAsGuest")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
