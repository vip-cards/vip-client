import { ReviewCard } from "components/Cards";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import clientServices from "../../services/clientServices";
import "./AccountInvite.scss";
import { getLocalizedNumber } from "helpers/lang";
import STOP_UGLY_CACHEING from "constants/configSWR";
import { useSelector } from "react-redux";
import { MainButton } from "components/Buttons";
import clipboardCopy from "clipboard-copy";
import endPoint from "services/endPoint";
import AgentCard from "components/Cards/AgentCard/AgentCard";
import { useState } from "react";

export default function AccountInvite() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const auth = useSelector((state) => state.auth);
  const { userData } = auth;
  const { referralCode, credit } = userData;

  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);

  async function fetchAgentsHAndler() {
    try {
      setLoading(true);
      let agentsData = await clientServices.listNearAgents();
      setAgents(agentsData.records);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="invite-header">
        <h1 className="orders-title">{t("invite")}</h1>
        <h4 className="orders-title">
          {t("referralCode")} : {referralCode}
        </h4>
        <h4 className="orders-title">
          {t("yourCredit")} : {credit}
        </h4>
        <div className="invitation-body">
          <h5 className="invite">invite your Friends And Earn Money</h5>
          <MainButton
            text="copyInvitationLink"
            onClick={() => {
              clipboardCopy(
                `${process.env.REACT_APP_IMG_URL}ref?by=${referralCode}`
              );
            }}
          />
          <MainButton
            text="seeNearAgents"
            onClick={() => {
              fetchAgentsHAndler();
            }}
          />
        </div>
      </header>
      <div className="orders-container px-2">
        {loading ? (
          <LoadingSpinner />
        ) : (
          agents.map((agent) => {
            return <AgentCard key={agent._id} agent={agent} />;
          })
        )}
      </div>
    </>
  );
}
