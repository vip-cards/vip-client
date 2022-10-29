import React, { useState } from "react";

import { ReactComponent as VendorLogo } from "../../assets/VIP-ICON-SVG/VendorLogo.svg";
import { ReactComponent as VendorLogoOrange } from "../../assets/VIP-ICON-SVG/VendorLogoOrange.svg";
import "./Login.scss";
import MainInput from "../../components/MainInput/MainInput";
import toastPopup from "../../helpers/toastPopup";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { switchLang } from "../../helpers/lang";
import MainButton from "../../components/MainButton/MainButton";
import vendorSevices from "../../services/vendorSevices";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import jwt_decode from "jwt-decode";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState("vendor");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const login = async (e) => {
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
        const { data } = await vendorSevices.login(user);

        if (data.success && data.code === 200) {
          setLoading(false);
          toastPopup.success(t("Success"));
          const tokenDecoded = jwt_decode(data.token);

          dispatch(
            authActions.login({
              token: data.token,
              userId: tokenDecoded._id,
              userRole: tokenDecoded.role,
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
        <form className="login-box app-card-shadow" onSubmit={login}>
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
          <div className="login-user-type">
            <p className="login-as">{t("login as")}</p>
            <div className="check-field">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="userType"
                  id={`userTypeVendor`}
                  checked={userType === "vendor"}
                  onChange={(e) => {
                    setUserType("vendor");
                  }}
                />
                <label className="form-check-label" htmlFor={`userTypeVendor`}>
                  {t("vendor")}
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="userType"
                  id={`userTypeBranch`}
                  checked={userType === "branch"}
                  onChange={(e) => {
                    setUserType("branch");
                  }}
                />
                <label className="form-check-label" htmlFor={`userTypeBranch`}>
                  {t("branch")}
                </label>
              </div>

              <div className="form-check-container">
                <input
                  type="radio"
                  className="form-check-input"
                  name="userType"
                  id={`userTypeCasheir`}
                  checked={userType === "casheir"}
                  onChange={(e) => {
                    setUserType("casheir");
                  }}
                />
                <label className="form-check-label" htmlFor={`userTypeCasheir`}>
                  {t("casheir")}
                </label>
              </div>
            </div>
          </div>
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
        </form>
      </div>
    </div>
  );
}
