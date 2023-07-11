import {
  faEdit,
  faLocation,
  faLocationDot,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getLocalizedWord } from "helpers/lang";
import "./AgentCard.scss";
import { t } from "i18next";

export default function ReviewCard({ agent: agentData }) {
  let agentName = agentData?.name;
  return (
    <div className="flex flex-col">
      <article className="agent-card relative">
        <div className="order-vendor-name">
          <a
            className="vendor-name-link"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.google.com/maps?q=${agentData?.location?.coordinates?.[0]},${agentData?.location?.coordinates?.[1]}`}
          >
            <h4>{getLocalizedWord(agentName) || "Agent name"}</h4>
          </a>
          <button
            onClick={() => {
              window.open(
                `https://www.google.com/maps?q=${agentData?.location?.coordinates?.[0]},${agentData?.location?.coordinates?.[1]}`,
                "_blank"
              );
            }}
          >
            <FontAwesomeIcon
              icon={faLocationDot}
              className="shadow-md hover:shadow hover:bg-primary transition-opacity text-white bg-primary/60 rounded-full p-1.5 aspect-square w-5 h-5"
            />
          </button>
        </div>

        <div className="order-points">
          {agentData?.address && (
            <p className="text">
              {t("address")} : {agentData?.address}
            </p>
          )}
        </div>

        <div className="order-points">
          {agentData?.phone && (
            <p className="text">
              {t("phone")} : {agentData?.phone}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
