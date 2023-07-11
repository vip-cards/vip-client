import clipboardCopy from "clipboard-copy";
import { MainButton } from "components/Buttons";
import AgentCard from "components/Cards/AgentCard/AgentCard";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import clientServices from "../../services/clientServices";
import "./AccountInvite.scss";

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
