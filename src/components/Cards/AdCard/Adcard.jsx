import {
  faBell,
  faBullhorn,
  faCalendarDays,
  faLocationDot,
  faRectangleAd,
  faRss,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";

import "./AdCard.scss";

const Adcard = ({ ad }) => {
  if (!ad) return <></>;

  const { name, status, country, city, from, to, link, type } = ad;
  const image = ad.image?.Location || "";

  const typeIcon = {
    notification: faBell,
    promotion: faBullhorn,
  };
  return (
    <div className="axd-card-container">
      <div className="flex flex-row flex-nowrap justify-between w-full">
        <h5 className="max-w-[80%] overflow-hidden whitespace-nowrap text-ellipsis">
          {name}
        </h5>
        <p className={classNames("ad-type-badge", type)}>
          <FontAwesomeIcon icon={typeIcon[type] || faRectangleAd} />
          {type}
        </p>
      </div>
      <div className="card-body">
        {!!image && (
          <div className="card-image">
            <img alt={name + "-img"} src={image} />
          </div>
        )}
        <div className="card-details">
          {!!status && (
            <div className="detail-row">
              <div className="icon">
                <FontAwesomeIcon icon={faRss} transform="flip-h" />
              </div>

              <div className="content">{status}</div>
            </div>
          )}

          <div className="detail-row">
            <div className="icon">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>

            <div className="content">
              {`${!!city ? getLocalizedWord(city) : ""} ${
                country ? getLocalizedWord(country) : ""
              }`}
            </div>
          </div>
          {!!from && !!to && (
            <div className="detail-row">
              <div className="icon">
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>

              <div className="content">
                {dayjs(from).format("DD/MM/YYYY")} <i>to</i>{" "}
                {dayjs(to).format("DD/MM/YYYY")}
              </div>
            </div>
          )}
          {!!link && (
            <div className="flex flex-row mt-auto">
              <MainButton size="small" className="ml-auto">
                <a href={`//${link}`} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </MainButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adcard;
