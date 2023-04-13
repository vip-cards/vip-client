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

export default function Branch() {
  const params = useParams();
  let branchId = params.branchId;
  let vendorId = params.vendorId;
  let lang = i18n.language;
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
    <div className="app-card-shadow page-wrapper pb-8 my-8 branch-container">
      <header className="rounded-3xl border-b-2 p-4 gap-4 pb-4 flex flex-col justify-between relative border-0">
        <div className="h-48 w-full bg-primary/20 overflow-hidden rounded-lg">
          <img
            src={branchhInfo?.cover?.Location}
            alt={getLocalizedWord(branchhInfo?.name) + " cover"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative pl-36 pt-2 pr-2">
          <div className="w-28 h-28 overflow-hidden rounded-full absolute -top-14 left-7 border-white border-4 shadow">
            <img
              src={branchhInfo?.image?.Location}
              alt={getLocalizedWord(branchhInfo?.name) + " img"}
            />
          </div>
          <div className="flex flex-row gap-3 justify-start items-center mb-3">
            <h4 className="text-primary font-semibold">
              {getLocalizedWord(branchhInfo?.name)}
            </h4>
            <div>
              <RatingStars rate={branchhInfo?.rate ?? 0} />
            </div>
            <div className="ml-auto">
              <span className="text-sm mr-2">
                {branchhInfo?.hasDelivery
                  ? "Delivery Availeble"
                  : "Delivery Not Availeble"}
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
        <div className="flex flex-row gap-4 items-center ml-6 pr-2">
          <p className="max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
            {getLocalizedWord(branchhInfo?.description)}
          </p>
          <button
            className="ml-auto flex flex-row gap-3 justify-center items-center cursor-pointer p-0 m-0 min-w-fit"
            onClick={startChatHandler}
          >
            <span className="font-semibold text-primary whitespace-nowrap">
              Chat with us
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
