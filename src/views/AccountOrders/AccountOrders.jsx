import { OrderCard } from "components/Cards";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import Select from "react-select";
import clientServices from "../../services/clientServices";
import "./AccountOrders.scss";
import { getLocalizedNumber } from "helpers/lang";
import { useState } from "react";
import STOP_UGLY_CACHEING from "constants/configSWR";

const statusFilter = [
  { value: "pending", label: "pending" },
  { value: "in progress", label: "In Progress" },
  { value: "delivered", label: "Delivered" },
];
const paymentFilter = [
  { value: "cash on delivery", label: "Cash on Delivery" },
  { value: "visa", label: "Visa" },
  { value: "branch", label: "branch" },
];

const fetchOrders = ([key, status, paymentMethod]) =>
  clientServices
    .listClientOrders({ status, paymentMethod })
    .then((res) => res.data.records);

export default function AccountOrders() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [status, setStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const {
    data: orderList,
    isLoading,
    error,
  } = useSWR(
    ["orders", status, paymentMethod],
    fetchOrders,
    STOP_UGLY_CACHEING
  );

  function renderOrders() {
    if (isLoading) return <LoadingSpinner />;
    if (error || (!isLoading && !orderList.length))
      return <NoData text="noItems" />;
    return orderList.map((order, idx) => {
      return <OrderCard key={order._id} order={order} />;
    });
  }
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
                orderList?.reduce((accumulator, item) => {
                  return accumulator + item.points;
                }, 0)
              )}
            </b>
          </p>
        </div>
        <div className="p-5 flex justify-between flex-row flex-wrap gap-4">
          <Select
            isClearable
            name="status"
            className="w-52"
            isRtl={lang === "ar"}
            styles={{
              control: (provided, state) => ({
                ...provided,
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: state.isFocused ? "0 0 0 1px #fc7300" : null,
                "&:hover": {
                  border: "1px solid #fc7300",
                },
              }),
              menu: (provided, state) => ({
                ...provided,
                zIndex: 100,
              }),
            }}
            options={statusFilter}
            placeholder={t("Status")}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => t(option.label)}
            onChange={(val) => setStatus(val?.value)}
          />
          <Select
            isClearable
            name="payment"
            className="w-52"
            isRtl={lang === "ar"}
            styles={{
              control: (provided, state) => ({
                ...provided,
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: state.isFocused ? "0 0 0 1px #fc7300" : null,
                "&:hover": {
                  border: "1px solid #fc7300",
                },
              }),
              menu: (provided, state) => ({
                ...provided,
                zIndex: 100,
              }),
            }}
            options={paymentFilter}
            placeholder={t("Payment method")}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => t(option.label)}
            onChange={(val) => setPaymentMethod(val?.value)}
          />
        </div>
      </header>

      <aside></aside>
      <div className="orders-container px-2">{renderOrders()}</div>
    </>
  );
}
