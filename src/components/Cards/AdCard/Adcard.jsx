import {
  faBell,
  faBullhorn,
  faCalendarDays,
  faLocationDot,
  faPencil,
  faRectangleAd,
  faRss,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";

import { ROUTES } from "constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectAuth } from "store/auth-slice";
import "./AdCard.scss";
import clientServices from "services/clientServices";
import toastPopup from "helpers/toastPopup";
import { preload } from "swr";
import { adDetailsFetcher } from "pages/Ads/_fetcher/adDetails";

const Adcard = ({ ad, mutate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);

  const currentCLient = auth?.userData?._id;
  const adId = ad?.[auth.userRole]?._id ?? "";
  const createdByMe = currentCLient === adId;
  if (!ad) return <></>;

  const { name, status, country, city, from, to, link, type } = ad;
  const image = ad.image?.Location || "";

  const typeIcon = {
    notification: faBell,
    promotion: faBullhorn,
  };

  const handleRemoveAd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    clientServices
      .removeAd(ad._id)
      .then(() => {
        toastPopup.success("Ad removed successfully!");
        mutate && mutate();
      })
      .finally(() => setLoading(false));
  };

  const handleEditAd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    preload(["ad", ad._id], adDetailsFetcher);

    navigate(`/${ROUTES.ADS.MAIN}/${ROUTES.ADS.CREATE}/${ad._id}`);
  };
  return (
    <Link
      to={`/${ROUTES.ADS.MAIN}/${ROUTES.ADS.CREATE}/${ad._id}`}
      className="block axd-card-container relative"
      onClick={() => {
        preload(["ad", ad._id], adDetailsFetcher);
      }}
    >
      {createdByMe && ad.status.includes("pending") && (
        <div className="absolute ltr:right-3 top-16 flex flex-col gap-3 rtl:left-3">
          <button
            className="text-amber-800 hover:text-amber-600 bg-white active:scale-90 transition-all duration-75
            "
            onClick={handleEditAd}
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            className="text-red-800 hover:text-red-600 active:scale-90 transition-transform bg-white"
            onClick={handleRemoveAd}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      )}
      <div className="flex flex-row flex-nowrap justify-between w-full">
        <h5 className="max-w-[80%] overflow-hidden whitespace-nowrap text-ellipsis">
          {name}
        </h5>
        <p
          className={classNames(
            "ad-type-badge rtl:!right-auto rtl:!-left-4",
            type
          )}
        >
          <FontAwesomeIcon icon={typeIcon[type] || faRectangleAd} />
          {t(type)}
        </p>
      </div>
      <div className="card-body rtl:flex-row-reverse">
        {!!image && (
          <div className="card-image">
            <img alt={name + "-img"} src={image} />
          </div>
        )}
        <div className="card-details ">
          {!!status && (
            <div className="detail-row">
              <div className="icon">
                <FontAwesomeIcon icon={faRss} transform="flip-h" />
              </div>

              <div className="content font-bold rtl:!text-right">
                {t(status)}
              </div>
            </div>
          )}

          <div className="detail-row">
            <div className="icon">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>

            <div className="content rtl:!text-right">
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

              <div className="content rtl:!text-right">
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
    </Link>
  );
};

export default Adcard;
