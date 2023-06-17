import { OrderCard } from "components/Cards";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import clientServices from "../../services/clientServices";
import "./AccountOrders.scss";
import { getLocalizedNumber } from "helpers/lang";

export default function AccountOrders() {
  const { t } = useTranslation();
  const {
    data: orderList,
    isLoading,
    error,
  } = useSWR(["orders"], () =>
    clientServices.listClientOrders().then((res) => res.data.records)
  );

  if (isLoading) return <LoadingSpinner />;
  if (error || (!isLoading && !orderList.length))
    return <NoData text="noItems" />;

  return (
    <>
      <header className="orders-header">
        <h1 className="orders-title">{t("orders")}</h1>
        <div className="flex justify-start shadow w-full p-4">
          <p className="">
            <span>{t("All Points")}</span>
            &nbsp;
            <b>
              {getLocalizedNumber(
                orderList.reduce((accumulator, item) => {
                  return accumulator + item.points;
                }, 0)
              )}
            </b>
          </p>
        </div>
      </header>

      <aside>
        
      </aside>
      <div className="orders-container">
        {orderList.length > 0 ? (
          <>
            {orderList.map((order, idx) => {
              return <OrderCard key={order._id} order={order} />;
            })}
          </>
        ) : null}
      </div>
    </>
  );
}
