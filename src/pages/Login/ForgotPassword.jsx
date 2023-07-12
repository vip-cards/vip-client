import { ReactComponent as VendorLogo } from "assets/VIP-ICON-SVG/VendorLogo.svg";
import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import { ROUTES } from "constants";
import { switchLang } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { t } from "i18next";
import jwtDecode from "jwt-decode";
import i18n from "locales/i18n";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import clientServices from "services/clientServices";

function LanguageToggle() {
  function changeLang(lang) {
    i18n.changeLanguage(lang);
    switchLang(lang);
  }
  return (
    <div className="absolute right-16 top-16">
      {localStorage.getItem("i18nextLng") === "en" ? (
        <button onClick={() => changeLang("ar")}>العربية</button>
      ) : (
        <button onClick={() => changeLang("en")}>English</button>
      )}
    </div>
  );
}

function SendRecoveryMailView({ input, setInput }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function handleRecorySend() {
    if (!input.email) {
      toastPopup.error("Please enter an email!");
      return;
    }
    setLoading(true);

    try {
      const res = await clientServices
        .recoveryCode({ email: input.email })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 300);
        });

      setInput((obj) => ({
        ...obj,
        step: 1,
        recievedCode: jwtDecode(res.token)?.code | "",
        token: res.token,
      }));
    } catch (e) {
      toastPopup.error(e.response?.data ?? "Something went wrong!");
    }
  }

  return (
    <>
      <h3>{t("forgotPassword")}</h3>
      <p className="w-2/3 my-3 text-center">{t("enterYourEmail")}</p>

      <MainInput
        state={input}
        setState={setInput}
        name="email"
        className="w-4/5"
      />

      <MainButton
        text="confirm"
        loading={loading}
        type="submit"
        className="w-4/5 mt-8"
        onClick={handleRecorySend}
      />
    </>
  );
}

function ConfirmCodeView({ input, setInput }) {
  async function handleCompareCode() {
    if (input.code.toString() === input.recievedCode.toString()) {
      toastPopup.success("Please check your email for the code!");
      setInput((obj) => ({
        ...obj,
        step: 2,
      }));
    } else {
      toastPopup.error("The code didn't match");
    }
  }
  return (
    <>
      <h3>{t("forgotPassword")}</h3>
      <p className="w-2/3 my-3 text-center">
        {t("Please enter the sent code")}
      </p>

      <MainInput
        state={input}
        setState={setInput}
        name="code"
        className="w-4/5"
      />

      <MainButton
        text="confirm"
        loading={false}
        type="submit"
        className="w-4/5 mt-8"
        onClick={handleCompareCode}
      />
    </>
  );
}

function NewPasswordView({ input, setInput }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleConfirmPassword() {
    if (input.password.toString() === input["confirmPassword"].toString()) {
      setLoading(true);

      const res = await clientServices
        .resetPassword(
          { email: input.email, newPassword: input.password },
          input.token
        )
        .then(() => {
          toastPopup.success("Password reset successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        })
        .catch((e) => {
          toastPopup.error(e.response?.data ?? "Something went wrong!");
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 300);
        });
    } else {
      toastPopup.error("The passwords didn't match");
    }
  }
  return (
    <>
      <h3>{t("forgotPassword")}</h3>
      <p className="w-2/3 my-3 text-center">
        {t("Please enter the new password")}
      </p>

      <MainInput
        state={input}
        setState={setInput}
        name="password"
        type="password"
        className="w-4/5"
      />
      <MainInput
        state={input}
        setState={setInput}
        name="confirmPassword"
        type="password"
        className="w-4/5"
      />

      <MainButton
        text="confirm"
        type="submit"
        loading={loading}
        className="w-4/5 mt-8"
        onClick={handleConfirmPassword}
      />
    </>
  );
}

function ForgetPassword() {
  const [input, setInput] = useState({ step: 0 });

  function render() {
    switch (input.step) {
      case 0:
        return <SendRecoveryMailView input={input} setInput={setInput} />;
      case 1:
        return <ConfirmCodeView input={input} setInput={setInput} />;
      case 2:
        return <NewPasswordView input={input} setInput={setInput} />;
      default:
        return <SendRecoveryMailView input={input} setInput={setInput} />;
    }
  }

  return (
    <div className="h-screen w-screen flex flex-row justify-center items-center max-md:flex-col ">
      <div className="w-1/2 h-full bg-primary flex justify-center items-center max-md:hidden">
        <VendorLogo className="p-5 max-w-xs w-96 h-96 text-white" />
      </div>

      <LanguageToggle />
      <div className="md:w-1/2  justify-center items-center flex flex-col relative max-md:h-full ">
        <div className="w-4/5 min-w-fit shadow-lg rounded-2xl p-5 flex flex-col items-center justify-between h-fit gap-4 max-w-2xl py-16">
          {render()}
          <div className="text-primary hover:opacity-80">
            <Link to={ROUTES.LOGIN}>{t("login")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
