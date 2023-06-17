import Modal from "components/Modal/Modal";
import OrderRequestsTable from "pages/CartPage/OrderRequestsTable";
import { Fragment, useState } from "react";
import clientServices from "services/clientServices";
import paymobServices from "services/paymob.services";
import useSWR from "swr";
const fetchAllRequests = () =>
  clientServices.getOrdersRequests().then(({ records }) => records);

const AccountOrderRequests = () => {
  const [paymentModal, setPaymentModal] = useState({ open: false, url: "" });

  const { data: requests = [], mutate } = useSWR(
    "all-order-requests",
    fetchAllRequests
  );

  async function handleOrderRequestProceed(orderId, amount) {
    const url = await paymobServices.paymobProcessURL(amount, orderId);
    setPaymentModal({ open: true, url });
  }

  return (
    <Fragment>
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
