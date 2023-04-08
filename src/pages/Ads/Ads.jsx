import CardContainer from "components/CardContainer/CardContainer";
import { ReactComponent as SponsorImg } from "assets/images/sponsor-img.svg";
import { useNavigate } from "react-router";
import "./Ads.scss";
import { MainButton } from "components/Buttons";
import { ROUTES } from "constants";

function SponsorAds() {
  const navigate = useNavigate();
  return (
    <CardContainer className="sponsor-page" title={"Sponsor Ads"}>
      <div className="page-container">
        <SponsorImg />
        <h2>Manage your AD</h2>
        <p>Edit or remove your AD and create new AD</p>

        <MainButton onClick={() => navigate(ROUTES.ADS.CREATE)}>
          create new ad
        </MainButton>
        <MainButton onClick={() => navigate(ROUTES.ADS.LIST)}>
          previous ads
        </MainButton>
      </div>
    </CardContainer>
  );
}

export default SponsorAds;
