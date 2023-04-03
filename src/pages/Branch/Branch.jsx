import React, { useEffect, useState } from "react";
import { ReactComponent as Rate } from "../../assets/VIP-ICON-SVG/rate.svg";
import "./Branch.scss";
import SearchInput from "../../components/SearchInput/SearchInput";
import { Outlet, useParams } from "react-router";
import RoutingTab from "../../components/RoutingTab/RoutingTab";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import i18n from "../../locales/i18n";
import clientServices from "../../services/clientServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { createRoom } from "services/socket/chat";
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

  return (
    <div className="app-card-shadow branch-container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="branch-details">
          <div className="rounded-2xl border-2 p-4 flex flex-row justify-between w-full">
            <div className="flex flex-col">
              <h3 className="branch-name">{`${
                branchhInfo?.vendor?.name?.[lang] || ""
              } - ${branchhInfo?.name?.[lang]}`}</h3>
              <p className="address">{branchhInfo?.address?.[lang]} </p>
            </div>

            <button
              className="flex flex-row gap-3 justify-center items-center cursor-pointer p-0 m-0"
              onClick={startChatHandler}
            >
              <span className="font-semibold text-primary">Chat with us</span>
              <FontAwesomeIcon
                icon={faCommentDots}
                size="2x"
                className="text-primary"
              />
            </button>
          </div>
        </div>
      )}
      <div className="search-input-container">
        <SearchInput />
      </div>

      <RoutingTab routes={routes} />

      <Outlet />
    </div>
  );
}
