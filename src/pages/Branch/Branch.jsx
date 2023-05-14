import { faCommentDots, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import RoutingTab from "components/RoutingTab/RoutingTab";
import SearchInput from "components/SearchInput/SearchInput";
import i18n from "locales/i18n";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import clientServices from "services/clientServices";
import { createRoom } from "services/socket/chat";

import "./Branch.scss";
import { getLocalizedWord } from "helpers/lang";
import classNames from "classnames";
import RatingStars from "components/RatingStars/RatingStars";
import { useTranslation } from "react-i18next";

export default function Branch() {
  const params = useParams();
  const branchId = params.branchId;
  const vendorId = params.vendorId;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  let routes;
  const [branchhInfo, setBranchInfo] = useState({
    name_en: "",
    name_ar: "",
    lat: "",
    lng: "",
    email: "",
    address_en: "",
    address_ar: "",
    phone: "",
    governorate: "",
    vendor: "",
  });

  async function getBranchDetailsHandler() {
    setLoading(true);
    try {
      const { data } = await clientServices.getBranchDetails(branchId);

      setBranchInfo(data.record[0]);

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  routes = [
    { name: "offers", route: `/vendors/${vendorId}/${branchId}/offers` },
    { name: "hot-deals", route: `/vendors/${vendorId}/${branchId}/hot-deals` },
  ];
  function startChatHandler() {
    createRoom({ branch: branchId });
  }

  useEffect(() => {
    getBranchDetailsHandler();
  }, [params]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pb-8 my-8 app-card-shadow page-wrapper branch-container">
      <header className="relative flex flex-col justify-between gap-4 p-4 pb-4 border-0 border-b-2 rounded-3xl">
        <div className="w-full h-48 overflow-hidden rounded-lg bg-primary/20">
          <img
            src={branchhInfo?.cover?.Location}
            alt={getLocalizedWord(branchhInfo?.name) + " cover"}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="relative pt-2 pr-2 pl-36">
          <div className="absolute overflow-hidden border-4 border-white rounded-full shadow w-28 h-28 -top-14 left-7">
            <img
              src={branchhInfo?.image?.Location}
              alt={getLocalizedWord(branchhInfo?.name) + " img"}
            />
          </div>
          <div className="flex flex-row items-center justify-start gap-3 mb-3">
            <h4 className="font-semibold text-primary">
              {getLocalizedWord(branchhInfo?.name)}
            </h4>
            <div>
              <RatingStars rate={branchhInfo?.rate ?? 0} />
            </div>
            <div className="ml-auto">
              <span className="mr-2 text-sm">
                {branchhInfo?.hasDelivery
                  ? "Delivery Available"
                  : "Delivery Not Available"}
              </span>
              <FontAwesomeIcon
                icon={faTruckFast}
                size="xl"
                className={classNames({
                  "text-primary": branchhInfo?.hasDelivery,
                  "text-slate-700": !branchhInfo?.hasDelivery,
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 pr-2 ml-6">
          <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {getLocalizedWord(branchhInfo?.description)}
          </p>
          <button
            className="flex flex-row items-center justify-center gap-3 p-0 m-0 ltr:ml-auto rtl:mr-auto cursor-pointer min-w-fit"
            onClick={startChatHandler}
          >
            <span className="font-semibold text-primary whitespace-nowrap">
              {t("chatWithUs")}
            </span>
            <FontAwesomeIcon
              icon={faCommentDots}
              size="2x"
              className="text-primary"
            />
          </button>
        </div>
      </header>

      <div className="p-8">
        <RoutingTab routes={routes} />

        <Outlet />
      </div>
    </div>
  );
}
