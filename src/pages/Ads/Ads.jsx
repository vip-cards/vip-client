import CardContainer from "components/CardContainer/CardContainer";
import { ReactComponent as SponsorImg } from "assets/images/sponsor-img.svg";
import { useNavigate } from "react-router";
import "./Ads.scss";
import { MainButton } from "components/Buttons";
import { ROUTES } from "constants";
import { useTranslation } from "react-i18next";

function SponsorAds() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <CardContainer className="sponsor-page" title={"Ads"}>
      <div className="page-container">
        <SponsorImg />
        <h2>{t("manageYourAds")}</h2>
          <p>{t("editOrCreateAd")}</p>

        <MainButton onClick={() => navigate(ROUTES.ADS.CREATE)}>
          {t("createAd")}
        </MainButton>
        <MainButton onClick={() => navigate(ROUTES.ADS.LIST)}>
          {t("previousAds")}
        </MainButton>
      </div>
    </CardContainer>
  );
}

export default SponsorAds;
