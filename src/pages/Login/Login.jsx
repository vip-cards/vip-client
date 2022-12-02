import React, { useState } from "react";

import { ReactComponent as VendorLogo } from "../../assets/VIP-ICON-SVG/VendorLogo.svg";
import { ReactComponent as VendorLogoOrange } from "../../assets/VIP-ICON-SVG/VendorLogoOrange.svg";
import MainInput from "../../components/MainInput/MainInput";
import toastPopup from "../../helpers/toastPopup";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { switchLang } from "../../helpers/lang";
import MainButton from "../../components/MainButton/MainButton";
import clientServices from "../../services/clientServices";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import jwt_decode from "jwt-decode";
import "./Login.scss";
import {
  auth,
  Gprovider,
  FBprovider,
  useSocialLogin,
} from "../../services/firebaseServices";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState("vendor");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socialLogin = useSocialLogin();
  const { t, i18n } = useTranslation();
  function changeLang(lang) {
    i18n.changeLanguage(lang);
    switchLang(lang);
  }

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  let formData = [
    { name: "email", type: "email", required: true },
    { name: "password", type: "password", required: true },
  ];

  function loginValidation(user) {
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        )
        .required(),
    });
    return schema.validate(user);
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
        const { data } = await clientServices.login(user);
        console.log(data);
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

  async function googleLoginHandler() {
    try {
      const result = await signInWithPopup(auth, Gprovider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      const { data } = await clientServices.loginBy({
        name: { en: user.displayName },
        email: user.email,
        googleId: user.uid,
        image: user.photoURL,
      });
      console.log(data);
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
    } catch (error) {
      setLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
      toastPopup.error(t("Something went wrong"));
      // const credential = GoogleAuthProvider.credentialFromError(error);
    }
  }
  async function facebookLoginHandler() {
    try {
      const result = await signInWithPopup(auth, FBprovider);
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(result);
      const { data } = await clientServices.loginBy({
        name: { en: user.displayName },
        email: user.email,
        googleId: user.uid,
        image: user.photoURL,
      });
      console.log(data);
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
    } catch (error) {
      setLoading(false);
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
      toastPopup.error(t("Something went wrong"));
      // const credential = GoogleAuthProvider.credentialFromError(error);
    }
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
                    {t("'email' must be a valid email")}{" "}
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
          <MainButton text={t("login")} loading={loading} onClick={() => {}} />
          <MainButton
            text="Google"
            loading={loading}
            className="google-button"
            onClick={() => socialLogin("google")}
          />
          <MainButton
            text="Facebook"
            loading={loading}
            className="facebook-button"
            onClick={() => socialLogin("facebook")}
          />
        </form>
      </div>
    </div>
  );
}
