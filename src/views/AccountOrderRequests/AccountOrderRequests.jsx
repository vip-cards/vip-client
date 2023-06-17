import Modal from "components/Modal/Modal";
import OrderRequestsTable from "pages/CartPage/OrderRequestsTable";
import { Fragment, useState } from "react";
import clientServices from "services/clientServices";
import paymobServices from "services/paymob.services";
import useSWR from "swr";
import Select from "react-select";
import { useTranslation } from "react-i18next";

const statusFilter = [
  { value: "pending", label: "pending" },
  { value: "vendor accepted", label: "Vendor Accepted" },
  { value: "vendor rejected", label: "Vendor Rejected" },
  { value: "client accepted", label: "Client Accepted" },
  { value: "client rejected", label: "Client Rejected" },
];

const fetchAllRequests = ([key, status]) =>
  clientServices.getOrdersRequests({ status }).then(({ records }) => records);

const AccountOrderRequests = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [paymentModal, setPaymentModal] = useState({ open: false, url: "" });
  const [status, setStatus] = useState(null);
  const { data: requests = [], mutate } = useSWR(
    ["all-order-requests", status],
    fetchAllRequests
  );

  async function handleOrderRequestProceed(orderId, amount) {
    const url = await paymobServices.paymobProcessURL(amount, orderId);
    setPaymentModal({ open: true, url });
  }

  return (
    <Fragment>
      <h1 className="title">{t("Order Requests")}</h1>

      <header>
        <div className="z-10 p-5 flex justify-between flex-row flex-wrap gap-4">
          <Select
            isClearable
            name="status"
            className="w-52"
            isRtl={lang === "ar"}
            options={statusFilter}
            placeholder={t("Status")}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => t(option.label)}
            onChange={(val) => setStatus(val?.value)}
          />
        </div>
      </header>
      <OrderRequestsTable
        requests={requests}
        handleOrderRequestProceed={handleOrderRequestProceed}
        refetch={mutate}
      />
      <Modal
        className="w-screen h-screen"
        visible={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, url: "" })}
      >
        {paymentModal.url && (
          <iframe
            title="payment"
            src={paymentModal.url}
            width="100%"
            height="100%"
            frameBorder="0"
          ></iframe>
        )}
      </Modal>
    </Fragment>
  );
};

export default AccountOrderRequests;
