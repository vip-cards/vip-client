import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import MainButton from "../../components/MainButton/MainButton";
import { useSocialLogin } from "../../services/firebaseServices";

export default function RegisterHome() {
  const socialLogin = useSocialLogin();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <MainButton
        text={t("CreateAccount")}
        type="button"
        onClick={() => navigate("create")}
      />
      <MainButton
        text="Google"
        className="google-button"
        onClick={() => socialLogin("google")}
      />
      <MainButton
        text="Facebook"
        className="facebook-button"
        onClick={() => socialLogin("facebook")}
      />
    </>
  );
}
