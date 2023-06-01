import { switchLang } from "helpers/lang";
import { loginSchema } from "helpers/schemas";
import toastPopup from "helpers/toastPopup";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import clientServices from "services/clientServices";
import { useSocialLogin } from "services/firebaseServices";
import { authActions } from "store/auth-slice";

import { ReactComponent as VendorLogo } from "assets/VIP-ICON-SVG/VendorLogo.svg";
import { ReactComponent as VendorLogoOrange } from "assets/VIP-ICON-SVG/VendorLogoOrange.svg";
import { ReactComponent as FacebookLogo } from "assets/icons/facebook.svg";
import { ReactComponent as GoogleLogo } from "assets/icons/google.svg";
import { ReactComponent as TwitterLogo } from "assets/icons/twitter.svg";
import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";

import "./Login.scss";
import { ROUTES } from "constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const socialLogin = useSocialLogin();

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [qrCode, setQrCode] = useState({ open: false, code: "" });
  const formData = [
    { name: "email", type: "email", required: true },
    { name: "password", type: "password", required: true },
  ];

  function changeLang(lang) {
    i18n.changeLanguage(lang);
    switchLang(lang);
  }

  function loginValidation(user) {
    return loginSchema.validate(user);
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    setErrorList([]);
    let validationResult = loginValidation(user);

    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      try {
        const result = await clientServices.login(user);
        const data = result.data;

        if (data.success && data.code === 200) {
          setLoading(false);

          toastPopup.success(t("Success"));
          const tokenDecoded = jwt_decode(data.token);

          dispatch(
            authActions.login({
              token: data.token,
              userId: tokenDecoded._id,
              userRole: tokenDecoded.role,
              userData: data.record,
            })
          );
          navigate("/");
        }
      } catch (e) {
        setLoading(false);
        setErrorMessage(e.response.data.error);
      }
    }
  };

  const guestLoginHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    setLoading(true);
    try {
      const result = await clientServices.loginAsGuest();
      const data = result.data;

      if (data.success && data.code === 200) {
        setLoading(false);

        toastPopup.success(t("Success"));
        const tokenDecoded = jwt_decode(data.token);

        dispatch(
          authActions.login({
            token: data.token,
            userId: tokenDecoded._id,
            userRole: tokenDecoded.role,
            userData: { role: tokenDecoded.role, type: "guest" },
          })
        );
        navigate("/");
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.error);
    }
  };

  const codeLoginHandler = async () => {
    if (!qrCode.open) {
      setQrCode((s) => ({ ...s, open: true }));
    } else {
      setLoading(true);
      try {
        const result = await clientServices.loginByCode(qrCode.code);
        const data = result?.data;
        console.log(result);

        if (data.success && data.code === 200) {
          setLoading(false);

          toastPopup.success(t("Success"));
          const tokenDecoded = jwt_decode(data.token);

          dispatch(
            authActions.login({
              token: data.token,
              userId: tokenDecoded._id,
              userRole: tokenDecoded.role,
              userData: data.record,
            })
          );
          navigate("/");
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        setErrorMessage(e.response.data.error);
      }
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
            <button onClick={() => changeLang("ar")}>العربية</button>
          ) : (
            <button onClick={() => changeLang("en")}>English</button>
          )}
        </div>

        <form className="login-box app-card-shadow" onSubmit={loginHandler}>
          <p>{t("login")}</p>

          {errorMessage ? (
            <div className="err">
              {errorMessage.includes("Client")
                ? t("Client is not found!")
                : t("Incorrect Password")}
            </div>
          ) : (
            ""
          )}
          {errorList.map((error, index) => {
            if (error.message.includes("password")) {
              return (
                <div className="err" key={index}>
                  {t("WRONG PASSWORD")}{" "}
                  <i className="fa-solid fa-circle-xmark"></i>
                </div>
              );
            } else {
              return (
                <div key={index}>
                  <div className="err" key={index}>
                    {t("'email' must be a valid email")}
                    <i className="fa-solid fa-circle-xmark"></i>
                  </div>
                </div>
              );
            }
          })}

          {formData.map((formInput, index) => {
            return (
              <MainInput
                key={index}
                name={formInput.name}
                type={formInput.type}
                required={formInput.required}
                state={user}
                setState={setUser}
              />
            );
          })}
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
            text={t("loginByCode")}
            loading={loading}
            type="button"
          />
          <div className="text-primary hover:opacity-80">
            <Link to={`/${ROUTES.FORGOT_PASSWORD}`}>Forgot Password?</Link>
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
          <p className="login-footer">
            <span>{t("notRegistered")}</span>
            &nbsp;
            <Link to="/register" className="link-item">
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
