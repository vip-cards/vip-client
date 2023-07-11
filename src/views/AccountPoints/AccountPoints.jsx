import { PointsCard } from "components/Cards";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import clientServices from "../../services/clientServices";
import "./AccountPoints.scss";
import { getLocalizedNumber } from "helpers/lang";
import STOP_UGLY_CACHEING from "constants/configSWR";

const fetchOrders = ([key]) =>
  clientServices.listClientPoints().then((res) => res.data.record);

export default function AccountPoints() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const {
    data: PointsData,
    isLoading,
    error,
  } = useSWR(["points"], fetchOrders, STOP_UGLY_CACHEING);

  function renderOrders() {
    if (isLoading) return <LoadingSpinner />;
    if (error || (!isLoading && !PointsData)) return <NoData text="noItems" />;
    return PointsData?.vendorPoints?.map((vendor, idx) => {
      return <PointsCard key={vendor._id} vendor={vendor} />;
    });
  }

  return (
    <>
      <header className="orders-header">
        <h1 className="orders-title">{t("points")}</h1>
        <div className="flex justify-between shadow w-full p-4">
          <p className="">
            <span>{t("Available Points")}</span>
            &nbsp;
            <b>{getLocalizedNumber(PointsData?.totalPoints)}</b>
          </p>
          <p className="">
            <span>{t("VIP Points")}</span>
            &nbsp;
            <b>{getLocalizedNumber(PointsData?.vipPoints)}</b>
          </p>
        </div>
      </header>

      <aside></aside>
      <div className="orders-container px-2">{renderOrders()}</div>
    </>
  );
}
