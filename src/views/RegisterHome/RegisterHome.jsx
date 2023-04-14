import { MainButton } from "components/Buttons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useSocialLogin } from "../../services/firebaseServices";

export default function RegisterHome() {
  const socialLogin = useSocialLogin();
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <MainButton
        text={t("CreateAccount")}
        type="button"
        onClick={() => navigate("create")}
      />
      <MainButton
        text={t("google")}
        className="google-button"
        onClick={() => socialLogin("google")}
      />
      <MainButton
        text={t("facebook")}
        className="facebook-button"
        onClick={() => socialLogin("facebook")}
      />
      <MainButton
        text={t("twitter")}
        className="twitter-button"
        onClick={() => socialLogin("twitter")}
      />
    </>
  );
}
