import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useTranslation } from "react-i18next";
import { switchLang } from "../../helpers/lang";
import { loginSchema } from "../../helpers/schemas";
import toastPopup from "../../helpers/toastPopup";
import { authActions } from "../../store/auth-slice";
import clientServices from "../../services/clientServices";
import { useSocialLogin } from "../../services/firebaseServices";
import MainInput from "../../components/MainInput/MainInput";
import MainButton from "../../components/MainButton/MainButton";
import { ReactComponent as VendorLogoOrange } from "../../assets/VIP-ICON-SVG/VendorLogoOrange.svg";
import { ReactComponent as VendorLogo } from "../../assets/VIP-ICON-SVG/VendorLogo.svg";
import "./Login.scss";

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

  let formData = [
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
    console.log(user);
    e.preventDefault();
    setErrorList([]);
    let validationResult = loginValidation(user);
    console.log(validationResult);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      try {
        const { data } = await clientServices.login(user);
        console.log(data);
        console.log(data.token);
        if (data.success && data.code === 200) {
          setLoading(false);

          toastPopup.success(t("Success"));
          const tokenDecoded = jwt_decode(data.token);

          console.log(tokenDecoded);
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
              {errorMessage.includes("Admin")
                ? t("Admin is not found!")
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
          <MainButton
            type="button"
            text={t("google")}
            loading={loading}
            className="google-button"
            onClick={() => socialLogin("google")}
          />
          <MainButton
            type="button"
            text={t("facebook")}
            loading={loading}
            className="facebook-button"
            onClick={() => socialLogin("facebook")}
          />
          <p className="login-footer">
            <span>{t("notRegistered")}</span>
            &nbsp;
            <Link to="/register" className="link-item">
              {t("CreateAccount")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
