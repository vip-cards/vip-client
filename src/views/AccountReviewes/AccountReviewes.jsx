import { ReviewCard } from "components/Cards";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import clientServices from "../../services/clientServices";
import "./AccountReviewes.scss";
import { getLocalizedNumber } from "helpers/lang";
import STOP_UGLY_CACHEING from "constants/configSWR";

const fetchOrders = ([key]) =>
  clientServices.listClientReviews().then((res) => res.data);

export default function AccountReviewes() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const {
    data: reviewsData,
    isLoading,
    error,
  } = useSWR(["reviews"], fetchOrders, STOP_UGLY_CACHEING);

  function renderOrders() {
    if (isLoading) return <LoadingSpinner />;
    if (error || (!isLoading && !reviewsData)) return <NoData text="noItems" />;
    return reviewsData?.records?.map((review, idx) => {
      return <ReviewCard key={review._id} review={review} />;
    });
  }

  return (
    <>
      <header className="orders-header">
        <h1 className="orders-title">{t("reviews")}</h1>
        <div className="flex justify-between shadow w-full p-4">
          <p className="">
            <span>{t("NumberOfReviews")}</span>
            &nbsp;
            <b>{getLocalizedNumber(reviewsData?.counts)}</b>
          </p>
        </div>
      </header>

      <aside></aside>
      <div className="orders-container px-2">{renderOrders()}</div>
    </>
  );
}
